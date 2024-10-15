import { logger } from "@utils/logger";
import { CustomError } from "./customError"; // Ensure this import path is correct
import { ErrorRule, HandshakeResponse } from "@apiTypes/types";

class ErrorHandler {
  private static errorRules: ErrorRule[] = [
    {
      condition: (e) => e.message.includes("Unauthorized."),
      message: "Unauthorized. Try refreshing your browser.",
    },
    {
      condition: (e) => e.message.includes("Error fetching todo"),
      message: "There was an error fetching the todo. Please try again.",
    },
    {
      condition: (e) => e.message.includes("Input validation error"),
      message: "Input validation error.",
    },
    {
      condition: (e) => e.message.includes("Error parsing socket body"),
      message: "Input validation error.",
    },
    //Any other conditions
  ];

  private static defaultErrorMessage =
    "Error occurred, please reach out to support.";

  static createErrorResponse(
    error: Error | CustomError,
    handshake: string
  ): HandshakeResponse {
    const errorMessage = this.getErrorMessage(error);
    const errorData = error instanceof CustomError ? error.data : {};

    logger.error(error.message, {
      handshake: handshake,
      ...(error instanceof CustomError && { errorData: error.data }),
    });

    return {
      success: false,
      data: errorData,
      message: errorMessage,
    };
  }

  private static getErrorMessage(error: Error | CustomError): string {
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

export default ErrorHandler;
