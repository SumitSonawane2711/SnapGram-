import { z } from "zod"

export const signupValidation = z.object({
    name:z.string().min(2,{message:'too short'}),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(2,{message:'Password must be at least 8 characters.'})
  })

  export const signinValidation = z.object({
    email: z.string().email(),
    password: z.string().min(2,{message:'Password must be at least 8 characters.'})
  })

  export const postFormValidation = z.object({
    caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    file: z.custom(),
    location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  })

  export const editProfileValidation = z.object({
    file:z.custom(),
    name:z.string().min(2,{message:'too short'}),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    bio: z.string().min(5,{ message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" })
  })