"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequests_1 = require("../types/httpRequests");
const RootCommand_1 = __importDefault(require("../commands/httpCommands/RootCommand"));
class HTTPCommandFactory {
    static registerCommand(commandType, command) {
        HTTPCommandFactory.commandMap.set(commandType, command);
    }
    static createCommand(type) {
        const command = HTTPCommandFactory.commandMap.get(type);
        if (!command) {
            throw new Error("Invalid http command.");
        }
        return command;
    }
    static initializeFactory() {
        HTTPCommandFactory.registerCommand(httpRequests_1.HTTPCommandTypes.RootHandshake, RootCommand_1.default.getInstance());
    }
}
HTTPCommandFactory.commandMap = new Map();
exports.default = HTTPCommandFactory;
