import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function getToken() {
    const res = await axios.post(`${BASE_URL}/auth`, {
        email: 'sc0867@srmist.edu.in',
        name: 'snehith chatrathi',
        rollNo: 'ra2311027010086',
        accessCode: 'QkbpxH',
        clientID: '2f52ec73-bb5c-4b74-8e35-31569f97a8c2',
        clientSecret: 'uPDkEGNsPxZrNBkh'
    });
    return res.data.access_token;
}

export async function GET(request: NextRequest) {
    try {
        const token = await getToken();
        const { searchParams } = new URL(request.url);
        const params: Record<string, string> = {};

        if (searchParams.get("notification_type")) {
            params.notification_type = searchParams.get("notification_type")!;
        }
        if (searchParams.get("limit")) {
            params.limit = searchParams.get("limit")!;
        }
        if (searchParams.get("page")) {
            params.page = searchParams.get("page")!;
        }

        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}