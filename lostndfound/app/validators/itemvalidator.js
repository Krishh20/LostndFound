import {z} from "zod";

export const createItemSchema=z.object({
 type :     z.string(),
  title   :      z.string(),
  description :    z.string(),
  category  :      z.string(),
  imageUrl  :      z.string(),
  location   :     z.string(),
})