import { HandshakeResponse, AccessControlResponse } from "@apiTypes/types";
import { Request, Response } from "express";
import { logger } from "@utils/logger";
import { TodoFetcher } from "@adapters/TodoFetcher";
import { CustomError } from "@utils/customError";
import { ILogger } from "@utils/ILogger";

export default abstract class HTTPHandshake {
  public logger: ILogger;
  public todoFetcher: TodoFetcher;
  constructor() {
    //Inject dependencies here
    this.logger = logger;
    this.todoFetcher = new TodoFetcher(process.env.TODO_URL as string);
  }
  async process(req: Request, res: Response) {
    const reqData = req.body;
    const accessData = await this.accessControl(req.headers.authorization);
    await this.validateInputData(reqData);
    await this.logHandshake(req.path, accessData.uid);
    const data = Object.assign({}, reqData, accessData);
    const returnData: HandshakeResponse = await this.execute(data);
    await this.returnData(returnData, res);
  }

  async accessControl(
    auth: string | undefined
  ): Promise<AccessControlResponse> {
    try {
      //Implement access control
      return { uid: "uid" };
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }
  abstract getValidationRules(): any[];
  async validateInputData(data: any): Promise<void> {
    const validationRules = this.getValidationRules();
    const errors = [];
    for (const rule of validationRules) {
      const result = await rule.run({ body: data });
      if (!result.isEmpty()) {
        errors.push(...result.array());
      }
      //Return immediately if any errors, doesn't process remaining fields.
      if (errors.length > 0) {
        throw new CustomError("Input validation error.", errors);
      }
    }
  }
  async logHandshake(path: string, uid: string) {
    this.logger.info("HTTP Request: " + path, {
      handshake: path,
      uid: uid,
    });
  }
  abstract execute(data: any): Promise<HandshakeResponse>;
  async returnData(returnData: any, res: Response) {
    res.status(200).json(returnData);
  }
}
