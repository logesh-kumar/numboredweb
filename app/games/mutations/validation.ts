import { z } from "zod"

export const CreateGame = z.object({
  magicNumber: z.number(),
  duration: z.number(),
  score: z.number(),
  createdDate: z.date(),
})

export const HasID = z.object({ id: z.number() })
export const UpdateGame = CreateGame.merge(HasID)
