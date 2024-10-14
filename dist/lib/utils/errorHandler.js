"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class ErrorHandler {
    static createErrorResponse(error, handshake) {
        console.log(error);
        logger_1.default.error(error);
        const errorMessage = this.getErrorMessage(error, handshake);
        return {
            success: false,
            data: {},
            message: errorMessage,
        };
    }
    static getErrorMessage(error, handshake) {
        for (const rule of this.errorRules) {
            if (rule.condition(error)) {
                return typeof rule.message === "function"
                    ? rule.message(error)
                    : rule.message;
            }
        }
        return this.defaultErrorMessage;
    }
}
ErrorHandler.errorRules = [
    {
        condition: (e) => e.message.includes("Unauthorized."),
        message: "Unauthorized. Try refreshing your browser.",
    },
    //Any other conditions
];
ErrorHandler.defaultErrorMessage = "Error occurred, please reach out to support.";
exports.default = ErrorHandler;
