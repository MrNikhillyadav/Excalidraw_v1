import {z} from "zod"

export const SignUpSchema = z.object({
    username : z
        .string()
        .min(3, "name too short")
        .max(16,"name too long"),
    email : z
        .email("Invalid email"),
    password : z
        .string()
        .min(4,"password too short")
        .max(16,"password too long")
})

export const LoginSchema = z.object({
    email : z
        .email("Invalid email"),
    password : z
        .string()
        .min(4,"password too short")
        .max(16,"password too long")
})

export const CreateRoomSchema = z.object({
  name : z.string().min(3,"name too short").max(16,"name too long")
})