import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetGame = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const game = await db.game.findFirst({ where: { createdDate: new Date() } })

  if (!game) throw new NotFoundError()

  return game
})
