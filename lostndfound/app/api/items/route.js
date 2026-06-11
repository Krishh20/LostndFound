import { NextResponse } from "next/server";
import {createItemSchema} from "../../validators/itemvalidator.js"
import { authmiddleware } from "../../middleware/authmiddleware.js";
import { prisma } from "../../db/db.js";
// import OpenAI from "openai";
import { getEmbedding } from "../../../lib/embedding.js";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const YOUR_TOKEN =process.env.API_KEY;
function cosineSimilarity(a,b){
  let dot = 0;
let magA = 0;
let magB = 0;
for (let i = 0; i < a.length; i++) {
  dot += a[i] * b[i];
  magA+= a[i]*a[i];
  magB += b[i] * b[i];
}
return dot / (
  Math.sqrt(magA) *
  Math.sqrt(magB)
);
}

export async function POST(req) {
const authResult = await authmiddleware(req);
const body = await req.json();
// check schema using zod, create, return response
const result=createItemSchema.safeParse(body);
if(!result.success){
return NextResponse.json({
    message:"validation error"
}, {status:400})
}
const {  type,
  title,
  description,
  category,
  imageUrl,
  location}=body

    const text = `
Title: ${title}
Description: ${description}
Category: ${category}
Location: ${location}
`;

  // const response = await openai.embeddings.create({
  //   model: "text-embedding-3-small",
  //   input: text,
  // });
// const embedding = JSON.stringify(
//   response.data[0].embedding
// );

// const res=await fetch(
//   "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
//   {
//     headers: {
//       Authorization: `Bearer ${YOUR_TOKEN}`,
//     },
//     method: "POST",
//     body: JSON.stringify({ inputs: text }),
//   }
// );
// const hfResponse = await res.json();

const embV = await getEmbedding(text);
const embeddingVector = JSON.stringify(embV);


  const item= await prisma.item.create({
    data:{
         type,
  title,
  description,
  category,
  imageUrl,
   embeddingVector,
  location,
    uploadedBy: {
          connect: { id: authResult.id }
        }
    }
})

const oppositeType =
  item.type === "LOST"
    ? "FOUND"
    : "LOST";

    const candidates = await prisma.item.findMany({
  where: {
    type: oppositeType
  }
});
 const emb =JSON.parse(item.embeddingVector);
for (const candidate of candidates) {
  const candidateEmbedding =
  JSON.parse(candidate.embeddingVector);
  const score = cosineSimilarity(
  emb,
  candidateEmbedding
);
if (score > 0.10) {
  await prisma.match.create({
  data: {
    lostItemId: (item.type=="LOST"?item.id:candidate.id),
    foundItemId: (item.type=="FOUND"?item.id:candidate.id),
    similarityScore: score,
  },
});

const lostOwnerId =
  item.type === "LOST"
    ? authResult.id
    : candidate.uploadedById;
      await prisma.notification.create({
  data: {
    userId: lostOwnerId,
    type: "MATCH_FOUND",
    title: "Possible Match Found",
    message: "We found a possible match for your item."
  }
});
}
}

return NextResponse.json({
    message:{ item}
}, {status:201})
}

export async function GET(req) {
// get from db, based on type then check
const {searchParams}= new URL(req.url);
const type=searchParams.get("type")
  const items=await prisma.item.findMany({
    where:  type?{type}:{}
  })
  return NextResponse.json({
     message:items
  }, {status:200})
}