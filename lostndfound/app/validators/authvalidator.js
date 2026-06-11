import {email, string, z} from "zod"

export const userSchemaValidator=z.object({
    name:z.string(),
    email:z.string().email("Invalid email"),
    password:z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email:z.string().email("Invalid email"),
  password:z.string().min(6, "Password must be at least 6 characters"),
});