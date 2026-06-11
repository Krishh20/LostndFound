
import { NextResponse } from "next/server";
import {prisma} from "../../../db/db.js"
import { updateItemSchema } from "../../../validators/itemvalidator.js";
import { stat } from "node:fs";
import { authmiddleware } from "../../../middleware/authmiddleware.js";
// in the param i get id of item, extract, get item by id
export async function GET(req, { params }) {

const {id}=await  params
const item= await prisma.item.findUnique({
    where:{
        id:Number(id)
    }
})
 if (!item) {
    return NextResponse.json(
      {
        message: "Item not found",
      },
      { status: 404 }
    );
  }
return NextResponse.json({
    message:item
}, {status:200})
}

export async function PATCH(req, {params}) {
    const {id}=await  params
    const authResult = await authmiddleware(req);
    const body = await req.json();
    const result=updateItemSchema.safeParse(body);
    if(!result.success){
        return NextResponse.json({
            message:"validation error"
        }, {status:400})
    }
    const item=prisma.item.update({
        where:{
            id:Number(id),
            uploadedById: authResult.id
        },
        data:result.data
    })
    return NextResponse.json({
        message:item
    }, {status:200})
}

export async function DELETE(params) {
    const authResult = await authmiddleware(req);
    const {id}=  params
const deletedItem= await prisma.item.delete({
    where:{
        id:Number(id),

        uploadedById: authResult.id
    }
})
return NextResponse.json({
    message:deletedItem
}, {status:200})
}