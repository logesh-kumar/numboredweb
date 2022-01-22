import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateGame = z.object({
  id: z.number(),
  text: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateGame),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const game = await db.game.update({ where: { id }, data })

    return game
  }
)
