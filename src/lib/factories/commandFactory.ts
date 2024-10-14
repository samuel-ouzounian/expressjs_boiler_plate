import { CommandType } from "@apiTypes/commandTypes";

interface Command {
  process: (...args: any[]) => Promise<void>;
}

export class CommandFactory<T extends CommandType> {
  private commandMap: Map<T, Command> = new Map();

  registerCommand(commandType: T, command: Command): void {
    this.commandMap.set(commandType, command);
  }

  createCommand(type: T): Command {
    const command = this.commandMap.get(type);
    if (!command) {
      throw new Error(`Invalid command: ${type}`);
    }
    return command;
  }
}
