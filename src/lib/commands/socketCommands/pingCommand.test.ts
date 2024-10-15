import Client from "socket.io-client";
import { server, io } from "../../../index";
import { CommandTypes } from "@apiTypes/commandTypes";
import PingCommand from "./pingCommand";

describe("PingCommand test suite", () => {
  let clientSocket: any;

  const initSocket = () => {
    return new Promise<any>((resolve, reject) => {
      const port = (server.address() as any).port;
      const socket = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
        forceNew: true,
        reconnectionDelay: 0,
        timeout: 5000,
      });

      socket.on("connect", () => {
        resolve(socket);
      });

      socket.on("connect_error", (error: any) => {
        reject(new Error(`Failed to connect: ${error.message}`));
      });

      setTimeout(() => {
        reject(new Error("Failed to connect within 5 seconds."));
      }, 5000);
    });
  };

  const destroySocket = (socket: any) => {
    return new Promise<void>((resolve) => {
      if (socket.connected) {
        socket.disconnect();
      }
      resolve();
    });
  };

  beforeEach(async () => {
    if (!server.listening) {
      await new Promise<void>((resolve) => {
        server.listen(0, () => resolve());
      });
    }
    clientSocket = await initSocket();
  });

  afterEach(async () => {
    await destroySocket(clientSocket);
  });

  afterAll((done) => {
    clientSocket.close();
    io.close(() => {
      server.close(() => {
        done();
      });
    });
  });

  const event = CommandTypes.Socket.ping;

  it("should respond to ping event", (done) => {
    clientSocket.emit(event, JSON.stringify({}));
    clientSocket.once(event, (response: any) => {
      expect(response).toHaveProperty("success");
      expect(response).toHaveProperty("data");
      expect(response).toHaveProperty("message");
      expect(response.success).toBe(true);
      expect(response.message).toBe("pong");
      done();
    });
  });

  it("should handle malformed JSON", (done) => {
    clientSocket.emit(event, "invalid json");
    clientSocket.once(event, (response: any) => {
      expect(response.success).toBe(false);
      expect(response.message).toBe("Input validation error.");
      done();
    });
  });

  it("should ignore additional data in the request", (done) => {
    clientSocket.emit(
      event,
      JSON.stringify({ extraData: "should be ignored" })
    );
    clientSocket.once(event, (response: any) => {
      expect(response.success).toBe(true);
      expect(response.message).toBe("pong");
      expect(response.data).toEqual({});
      done();
    });
  });

  it("should handle errors gracefully", (done) => {
    jest
      .spyOn(PingCommand.prototype as any, "execute")
      .mockRejectedValueOnce(new Error("Test error"));

    clientSocket.emit(event, JSON.stringify({}));
    clientSocket.once(event, (response: any) => {
      expect(response.success).toBe(false);
      expect(response.message).toBe(
        "Error occurred, please reach out to support."
      );
      done();
    });
  });
});
