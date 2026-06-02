
import { NextResponse } from "next/server";
// in the param i get id of item, extract, get item by id
export async function GET(req, { params }) {
const {id}=  params
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

export async function PUT(params) {
    const authResult = await authMiddleware(req);
     
}

export async function DELETE(params) {
    const authResult = await authMiddleware(req);
    const {id}=  params
const deletedItem= await prisma.item.delete({
    where:{
        id:Number(id)
    }
})
return NextResponse.json({
    message:deletedItem
}, {status:200})
}