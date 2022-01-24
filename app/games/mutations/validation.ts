import { z } from "zod"

export const CreateGame = z.object({
  duration: z.number(),
  score: z.number(),
  magicNumberId: z.number(),
  userId: z.number(),
  attempt: z.number(),
})

export const HasID = z.object({ id: z.number() })
export const UpdateGame = CreateGame.merge(HasID)
export const UpdateUserGame = z.object({})
