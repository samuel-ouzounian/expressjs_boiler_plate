import { HandshakeResponse, Todo } from "@apiTypes/types";
import HTTPHandshake from "../../templates/httpHandshake";
import { CustomError } from "@utils/customError";
import { body } from "express-validator";

export default class RetriveTodoCommand extends HTTPHandshake {
  private static instance: RetriveTodoCommand;
  private constructor() {
    super();
  }

  public static getInstance(): RetriveTodoCommand {
    if (!RetriveTodoCommand.instance) {
      RetriveTodoCommand.instance = new RetriveTodoCommand();
    }
    return RetriveTodoCommand.instance;
  }
  getValidationRules() {
    return [body("id").notEmpty().isNumeric()];
  }
  async execute(data: any): Promise<HandshakeResponse> {
    try {
      const todo: Todo = await this.todoFetcher.fetchTodo(data.id);
      return {
        success: true,
        data: { todo },
        message: "Todo retrieved.",
      } as HandshakeResponse;
    } catch (error: any) {
      throw new CustomError(error.message);
    }
  }
}
