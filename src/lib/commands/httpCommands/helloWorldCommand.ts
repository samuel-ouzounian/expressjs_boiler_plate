import { HandshakeResponse } from "@apiTypes/types";
import HTTPHandshake from "../../templates/httpHandshake";
import { CustomError } from "@utils/customError";

export default class HelloWorldCommand extends HTTPHandshake {
  private static instance: HelloWorldCommand;
  private constructor() {
    super();
  }

  public static getInstance(): HelloWorldCommand {
    if (!HelloWorldCommand.instance) {
      HelloWorldCommand.instance = new HelloWorldCommand();
    }
    return HelloWorldCommand.instance;
  }
  getValidationRules() {
    return [];
  }

  async execute(data: any): Promise<HandshakeResponse> {
    try {
      return {
        success: true,
        data: {},
        message: "Hello, World!",
      } as HandshakeResponse;
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }
}
