import { Request, Response } from "express";
import { CommandFactory } from "@factories/commandFactory";
import { HTTPCommandType, CommandTypes } from "@apiTypes/commandTypes";
import ErrorHandler from "@utils/errorHandler";

export class HttpService {
  private static instance: HttpService;
  private factory: CommandFactory<HTTPCommandType>;

  private constructor() {
    this.factory = new CommandFactory<HTTPCommandType>();
    this.initializeCommands();
  }

  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService();
    }
    return HttpService.instance;
  }

  private initializeCommands(): void {
    // Register HTTP commands dynamically
    Object.keys(CommandTypes.HTTP).forEach((key) => {
      const commandType = key as HTTPCommandType;
      const CommandClass =
        require(`@commands/httpCommands/${key}Command`).default;
      this.factory.registerCommand(commandType, CommandClass.getInstance());
    });
  }

  public async handle(
    req: Request,
    res: Response,
    type: HTTPCommandType
  ): Promise<void> {
    try {
      const command = this.factory.createCommand(type);
      await command.process(req, res);
    } catch (error: any) {
      const errorResponse = ErrorHandler.createErrorResponse(error, type);
      res.status(200).json(errorResponse);
    }
  }
}
