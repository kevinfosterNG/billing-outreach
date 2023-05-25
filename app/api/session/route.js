import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("Called session API...");
  const session = await getServerSession(authOptions);

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}