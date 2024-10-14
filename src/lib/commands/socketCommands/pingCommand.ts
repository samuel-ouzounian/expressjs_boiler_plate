import { HandshakeResponse } from "@apiTypes/types";
import SocketHandshake from "../../templates/socketHandshake";

export default class PingCommand extends SocketHandshake {
  private static instance: PingCommand;
  private constructor() {
    super();
  }

  public static getInstance(): PingCommand {
    if (!PingCommand.instance) {
      PingCommand.instance = new PingCommand();
    }
    return PingCommand.instance;
  }
  getValidationRules() {
    return [];
  }
  async execute(data: any): Promise<HandshakeResponse> {
    try {
      return {
        success: true,
        data: {},
        message: "pong",
      } as HandshakeResponse;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
