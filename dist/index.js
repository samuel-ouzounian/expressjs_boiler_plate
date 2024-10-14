"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const httpService_1 = __importDefault(require("./lib/services/httpService"));
const httpRequests_1 = require("./lib/types/httpRequests");
const httpServiceInstance = httpService_1.default.getInstance();
dotenv_1.default.config();
const origins = ["*"];
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: origins }));
app.use(express_1.default.json());
app.get("/", (req, res) => httpServiceInstance.handle(req, res, httpRequests_1.HTTPCommandTypes.RootHandshake));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
