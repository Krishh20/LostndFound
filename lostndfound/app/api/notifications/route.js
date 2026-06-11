import { NextResponse } from "next/server";
import { authmiddleware } from "../../middleware/authmiddleware.js";
import { prisma } from "../../db/db.js";

export async function GET(req) {
  const auth = await authmiddleware(req);

  const notifications = await prisma.notification.findMany({
    where: {
        userId: auth.id
    }
  });

  return NextResponse.json({
    notifications,
  });
}