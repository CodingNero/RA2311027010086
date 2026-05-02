import axios from "axios";

const LOG_API = "http://20.207.122.201/evaluation-service/logs";

let authToken: string = "";

export function setAuthToken(token: string) {
    authToken = token;
}

export async function Log(
    stack: string,
    level: string,
    packageName: string,
    message: string
): Promise<void> {
    try {
        await axios.post(
            LOG_API,
            {
                stack,
                level,
                package: packageName,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Logging failed:", error);
    }
}