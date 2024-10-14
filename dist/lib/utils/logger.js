"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Logtail } = require("@logtail/node");
const logtail = new Logtail(process.env.BETTER_STACK_SOURCE_TOKEN);
exports.default = logtail;
