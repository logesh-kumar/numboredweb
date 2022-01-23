import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateGame = z.object({
  text: z.string(),
})

export default resolver.pipe(resolver.zod(CreateGame), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  //const game = await db.game.create({ data: input })

  return null
})
