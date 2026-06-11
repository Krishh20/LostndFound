



import { NextResponse } from "next/server";
import { authmiddleware } from "../../../../middleware/authmiddleware";
import { prisma } from "../../../../db/db";
import { submitAnswersSchema  } from "../../../../validators/claimvalidator";


export async function POST(req, {params}) {
    const {id}=await params
    const body=await req.json()
    const result= submitAnswersSchema.safeParse(body);
    if(!result.success){
    return NextResponse.json({
        message:"validation error"
    }, {status:400})
}

const authResult=await authmiddleware(req)
const claim= await prisma.claim.findFirst({
    where:{
         id:Number(id),
        claimerId:authResult.id
    }
}
)

  for(const item of result.data.answers){
      await prisma.claimAnswer.update({
        where:{
            id: item.questionId
        },
        data: {
            answer:item.answer
        }
      })

  }
const answers = await prisma.claimAnswer.findMany({
  where: {
    claimId:claim.id
  }
});
  return NextResponse.json({
   answers
  },  {status:200})
}
