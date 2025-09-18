import { NextRequest, NextResponse } from "next/server";
import { SearchLog } from "../../../types/weather";

let logs: SearchLog[] = [];

export async function POST(req: NextRequest) {
    const body = await req.json();
    logs.push(body);
    return NextResponse.json({ message: "Search logged successfully" });
}

export async function GET() {
    return NextResponse.json(logs);
}
