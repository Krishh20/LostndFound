import { pipeline } from "@xenova/transformers";

let generator = null;

async function getGenerator() {
  if (!generator) {
    generator = await pipeline(
    "text2text-generation",
  "Xenova/t5-small"
    );
  }
  return generator;
}

export async function question(prompt) {
  const model = await getGenerator();

  const result = await model(prompt, {
    max_new_tokens: 100,
  });

  return result[0].generated_text;
}