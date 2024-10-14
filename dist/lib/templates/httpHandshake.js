"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
class HTTPHandshake {
    constructor() {
        //Inject dependencies here
        this.logtail = logger_1.default;
    }
    process(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            const accessData = yield this.accessControl(req.auth);
            const data = Object.assign({}, reqData, accessData);
            //Logger to log request info
            this.logtail.info("HTTP Request: " + req.path, {
                event: req.path,
                uid: data.uid,
            });
            const returnData = yield this.execute(data);
            yield this.returnData(returnData, res);
        });
    }
    accessControl(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Implement access control
                return { uid: "uid" };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    returnData(returnData, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(returnData);
        });
    }
}
exports.default = HTTPHandshake;
