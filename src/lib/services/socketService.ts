import { Server, Socket } from "socket.io";
import { CommandFactory } from "@factories/commandFactory";
import { SocketCommandType, CommandTypes } from "@apiTypes/commandTypes";
import ErrorHandler from "@utils/errorHandler";

export class SocketService {
  private static instance: SocketService;
  private factory: CommandFactory<SocketCommandType>;

  private constructor() {
    this.factory = new CommandFactory<SocketCommandType>();
    this.initializeCommands();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private initializeCommands(): void {
    // Register Socket commands dynamically
    Object.keys(CommandTypes.Socket).forEach((key) => {
      const commandType = key as SocketCommandType;
      const CommandClass =
        require(`@commands/socketCommands/${key}Command`).default;
      this.factory.registerCommand(commandType, CommandClass.getInstance());
    });
  }

  public async handle(
    socket: Socket,
    data: any,
    type: SocketCommandType,
    io: Server,
    event: string
  ): Promise<void> {
    try {
      const command = this.factory.createCommand(type);
      await command.process(socket, data, event, io);
    } catch (error: any) {
      const errorResponse = ErrorHandler.createErrorResponse(error, type);
      socket.emit(type, errorResponse);
    }
  }
}
