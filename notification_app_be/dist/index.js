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
const axios_1 = __importDefault(require("axios"));
const { Log, setAuthToken } = require("C:\\Users\\snehi\\Desktop\\Afford\\RA2311027010086\\logging_middleware\\dist\\index");
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjY4OCwiaWF0IjoxNzc3NzAxNzg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzRjNTY0ZjYtMmU3Yi00MGViLTk2YTctNGM4YjQ3NzhmZTYwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic25laGl0aCBjaGF0cmF0aGkiLCJzdWIiOiIyZjUyZWM3My1iYjVjLTRiNzQtOGUzNS0zMTU2OWY5N2E4YzIifSwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzbmVoaXRoIGNoYXRyYXRoaSIsInJvbGxObyI6InJhMjMxMTAyNzAxMDA4NiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjJmNTJlYzczLWJiNWMtNGI3NC04ZTM1LTMxNTY5Zjk3YThjMiIsImNsaWVudFNlY3JldCI6InVQRGtFR05zUHhack5Ca2gifQ.mhr8ZiFTgE76lPLGqd2tl7CqHc0288NHChOZRe_GpH0";
const NOTIFICATIONS_API = "http://20.207.122.201/evaluation-service/notifications";
setAuthToken(AUTH_TOKEN);
function getWeight(type) {
    if (type === "Placement")
        return 3;
    if (type === "Result")
        return 2;
    return 1; // Event
}
function fetchNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Log("backend", "info", "service", "Fetching notifications from API");
        const response = yield axios_1.default.get(NOTIFICATIONS_API, {
            headers: {
                Authorization: `Bearer ${AUTH_TOKEN}`,
            },
        });
        yield Log("backend", "info", "service", `Fetched ${response.data.notifications.length} notifications`);
        return response.data.notifications;
    });
}
function getTopN(notifications, n) {
    return notifications
        .sort((a, b) => {
        const weightDiff = getWeight(b.Type) - getWeight(a.Type);
        if (weightDiff !== 0)
            return weightDiff;
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
        .slice(0, n);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Log("backend", "info", "service", "Starting Priority Inbox");
            const notifications = yield fetchNotifications();
            const top10 = getTopN(notifications, 10);
            yield Log("backend", "info", "service", `Top 10 priority notifications calculated`);
            console.log("Top 10 Priority Notifications:");
            console.log(JSON.stringify(top10, null, 2));
        }
        catch (error) {
            yield Log("backend", "error", "service", `Error: ${error}`);
            console.error("Error:", error);
        }
    });
}
main();
