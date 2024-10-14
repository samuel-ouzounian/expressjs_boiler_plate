import { Server, Socket } from "socket.io";
import { HandshakeResponse, AccessControlResponse } from "@apiTypes/types";
import { logger } from "@utils/logger";
import { ValidationChain } from "express-validator";
import { CustomError } from "@utils/customError";
import { ILogger } from "@utils/ILogger";

export default abstract class SocketHandshake {
  public logger: ILogger;
  constructor() {
    //Inject dependencies here
    this.logger = logger;
  }
  async process(socket: Socket, inputData: any, event: string, io: any) {
    const sockData = this.parseData(inputData);
    await this.validateInputData(sockData);
    const accessData = await this.accessControl(sockData.auth as string);
    const data = Object.assign({}, sockData, accessData);
    const returnData: HandshakeResponse = await this.execute(data, socket);
    await this.returnData(returnData, socket, event, io);
  }
  parseData(data: any): any {
    try {
      return JSON.parse(data);
    } catch (error: any) {
      throw new Error("Error parsing socket body.");
    }
  }

  async accessControl(auth: string): Promise<AccessControlResponse> {
    try {
      //Implement access control
      return { uid: "uid" };
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }
  abstract getValidationRules(): ValidationChain[];
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

  async logHandshake(event: string, uid: string) {
    this.logger.info("Socket Event: " + event, {
      handshake: event,
      uid: uid,
    });
  }
  abstract execute(data: any, socket: Socket): Promise<HandshakeResponse>;
  //Pass io as a variable for any room emissions if needed
  async returnData(returnData: any, socket: Socket, event: string, io: Server) {
    socket.emit(event, returnData);
  }
}
