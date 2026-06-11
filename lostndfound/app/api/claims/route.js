// create, get

// validate claim schema,
import { NextResponse } from "next/server";
import { authmiddleware } from "../../middleware/authmiddleware.js";
import { prisma } from "../../db/db";
import { createClaimSchema } from "../../validators/claimvalidator";

 const KEY = process.env.OPEN_API_KEY;

export async function POST(req) {
const body= await req.json()
const authResult=await authmiddleware(req)
const result=createClaimSchema.safeParse(body)
if(!result.success){
    return NextResponse.json({
        message:"validation error"
    }, {status:400})
}
 const {matchId}=body
const claim=await prisma.claim.create({
    data:{
       matchId:  Number(matchId),
    claimerId: authResult.id

    }
})

const match = await prisma.match.findUnique({
  where: {
    id: Number(matchId),
  },
  include: {
    lostItem: true,
    foundItem: true,
  },
});

const item = match.lostItem;



// const completion = await openai.chat.completions.create({
//   model: "gpt-5",
//   messages: [
//     {
//       role: "user",
//       content: prompt,
//     },
//   ],
// });
//  const res=await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct", {
//   headers: {
//     Authorization: `Bearer YOUR_HF_TOKEN`,
//   },
//   method: "POST",
//   body: JSON.stringify({
//     inputs: prompt
//   }),
// });
// const generatedText = await question(prompt);
// const questions = generatedText
//   .split("\n")
//   .map(q => q.trim())
//   .filter(q => q.length > 0);



const prompt = `
Generate exactly 5 ownership verification questions.

Item Title:
${item.title}

Description:
${item.description}

Category:
${item.category}

Location:
${item.location}

The questions should help verify whether someone is the true owner.

Return ONLY valid JSON in this format:

{
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5"
  ]
}
`;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });
const data = await response.json(); // IMPORTANT
console.log("DATA:", data);
const text = data.choices[0].message.content;
const parsed = JSON.parse(text);
  for (const question of parsed.questions) {
  await prisma.claimAnswer.create({
    data: {
      claimId: claim.id,
      question,
    },
  });
}

return NextResponse.json({
    claim
}, {status:201})
}
