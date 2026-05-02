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
exports.setAuthToken = setAuthToken;
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const LOG_API = "http://20.207.122.201/evaluation-service/logs";
let authToken = "";
function setAuthToken(token) {
    authToken = token;
}
function Log(stack, level, packageName, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield axios_1.default.post(LOG_API, {
                stack,
                level,
                package: packageName,
                message,
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
        }
        catch (error) {
            console.error("Logging failed:", error);
        }
    });
}
