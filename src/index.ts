import "./paths";
import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { HttpService } from "@services/httpService";
import http from "http";
import { SocketService } from "@services/socketService";
import {
  CommandTypes,
  HTTPCommandType,
  SocketCommandType,
} from "@apiTypes/commandTypes";
/*Service instances*/
const httpServiceInstance = HttpService.getInstance();
const socketServiceInstance = SocketService.getInstance();
/*App setup*/
const origins: Array<string> = ["*"];
export const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: origins }));
app.use(express.json());

/*Socket setup*/
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: origins,
    methods: ["GET", "POST"],
  },
});

// Dynamic HTTP routes
Object.entries(CommandTypes.HTTP).forEach(([commandType, route]) => {
  app.post(route, (req, res) => {
    httpServiceInstance.handle(req, res, commandType as HTTPCommandType);
  });
});

// Dynamic Socket events
io.on("connection", (socket) => {
  Object.entries(CommandTypes.Socket).forEach(([commandType, event]) => {
    socket.on(event, async (data: any) => {
      socketServiceInstance.handle(
        socket,
        data,
        commandType as SocketCommandType,
        io,
        event
      );
    });
  });
});

//Root health check
app.get("/", (req, res) => {
  res.status(200).send("I'm alive!");
});

//Keep this so supertest can run
if (require.main === module) {
  server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}
