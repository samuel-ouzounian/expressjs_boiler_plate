/*
Key: Command Name
Value: Route or Event
 */

export const CommandTypes = {
  HTTP: {
    helloWorld: "/hello-world",
    retrieveTodo: "/retrieve-todo",
    // Add more HTTP routes here
  },
  Socket: {
    ping: "ping",
    // Add more Socket events here
  },
} as const;

export type HTTPCommandType = keyof typeof CommandTypes.HTTP;
export type SocketCommandType = keyof typeof CommandTypes.Socket;
export type CommandType = HTTPCommandType | SocketCommandType;
