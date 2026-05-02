import axios from "axios";
const { Log, setAuthToken } = require("C:\\Users\\snehi\\Desktop\\Afford\\RA2311027010086\\logging_middleware\\dist\\index");

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjY4OCwiaWF0IjoxNzc3NzAxNzg4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzRjNTY0ZjYtMmU3Yi00MGViLTk2YTctNGM4YjQ3NzhmZTYwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic25laGl0aCBjaGF0cmF0aGkiLCJzdWIiOiIyZjUyZWM3My1iYjVjLTRiNzQtOGUzNS0zMTU2OWY5N2E4YzIifSwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzbmVoaXRoIGNoYXRyYXRoaSIsInJvbGxObyI6InJhMjMxMTAyNzAxMDA4NiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjJmNTJlYzczLWJiNWMtNGI3NC04ZTM1LTMxNTY5Zjk3YThjMiIsImNsaWVudFNlY3JldCI6InVQRGtFR05zUHhack5Ca2gifQ.mhr8ZiFTgE76lPLGqd2tl7CqHc0288NHChOZRe_GpH0";
const NOTIFICATIONS_API = "http://20.207.122.201/evaluation-service/notifications";

setAuthToken(AUTH_TOKEN);

interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

function getWeight(type: string): number {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1; // Event
}

async function fetchNotifications(): Promise<Notification[]> {
    await Log("backend", "info", "service", "Fetching notifications from API");
    const response = await axios.get(NOTIFICATIONS_API, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        },
    });
    await Log("backend", "info", "service", `Fetched ${response.data.notifications.length} notifications`);
    return response.data.notifications;
}

function getTopN(notifications: Notification[], n: number): Notification[] {
    return notifications
        .sort((a, b) => {
            const weightDiff = getWeight(b.Type) - getWeight(a.Type);
            if (weightDiff !== 0) return weightDiff;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        })
        .slice(0, n);
}

async function main() {
    try {
        await Log("backend", "info", "service", "Starting Priority Inbox");
        const notifications = await fetchNotifications();
        const top10 = getTopN(notifications, 10);

        await Log("backend", "info", "service", `Top 10 priority notifications calculated`);
        console.log("Top 10 Priority Notifications:");
        console.log(JSON.stringify(top10, null, 2));
    } catch (error) {
        await Log("backend", "error", "service", `Error: ${error}`);
        console.error("Error:", error);
    }
}

main();