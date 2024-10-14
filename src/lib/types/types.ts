import { CustomError } from "@utils/customError";

export interface HandshakeResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface AccessControlResponse {
  uid: string;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
export interface ErrorRule {
  condition: (error: Error | CustomError) => boolean;
  message: string | ((error: Error | CustomError) => string);
}
