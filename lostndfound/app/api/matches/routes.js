import { NextResponse } from "next/server";
import {createMatchSchema} from "../../validators/matchvalidator.js"
import { authmiddleware } from "../../middleware/authmiddleware.js";
import { prisma } from "../../db/db.js";

export async function GET(req) {
  const auth = await authmiddleware(req);

  const matches = await prisma.match.findMany({
    where: {
      lostItem: {
        uploadedById: auth.id,
      },
    },
  });

  return NextResponse.json({
    matches,
  });
}