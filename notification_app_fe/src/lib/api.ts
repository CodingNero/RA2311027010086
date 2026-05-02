import axios from "axios";

const BASE_URL = "http://20.207.122.201/evaluation-service";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTU2MCwiaWF0IjoxNzc3NzA0NjYwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjY2ZDk5YjQtMDUxNy00YzE0LTg5NWUtNTk5ZDQwNzI0NjViIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic25laGl0aCBjaGF0cmF0aGkiLCJzdWIiOiIyZjUyZWM3My1iYjVjLTRiNzQtOGUzNS0zMTU2OWY5N2E4YzIifSwiZW1haWwiOiJzYzA4NjdAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzbmVoaXRoIGNoYXRyYXRoaSIsInJvbGxObyI6InJhMjMxMTAyNzAxMDA4NiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6IjJmNTJlYzczLWJiNWMtNGI3NC04ZTM1LTMxNTY5Zjk3YThjMiIsImNsaWVudFNlY3JldCI6InVQRGtFR05zUHhack5Ca2gifQ.kW2BkBtbQNpA3fJLSJucHjeoM_WUVAgfVM-sBhGuGOQ";

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
    },
});

export interface Notification {
    ID: string;
    Type: "Placement" | "Result" | "Event";
    Message: string;
    Timestamp: string;
}

export async function fetchNotifications(params?: {
    limit?: number;
    page?: number;
    notification_type?: string;
}): Promise<Notification[]> {
    const response = await axios.get("/api/notifications", { params });
    return response.data.notifications;
}

export function getWeight(type: string): number {
    if (type === "Placement") return 3;
    if (type === "Result") return 2;
    return 1;
}

export function getTopN(notifications: Notification[], n: number, viewed?: Set<string>): Notification[] {
    return [...notifications]
        .sort((a, b) => {
            if (viewed) {
                const aUnread = !viewed.has(a.ID);
                const bUnread = !viewed.has(b.ID);
                if (aUnread && !bUnread) return -1;
                if (!aUnread && bUnread) return 1;
            }
            const weightDiff = getWeight(b.Type) - getWeight(a.Type);
            if (weightDiff !== 0) return weightDiff;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        })
        .slice(0, n);
}