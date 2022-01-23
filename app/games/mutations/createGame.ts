import { resolver } from "blitz"
import db from "db"
import { CreateGame } from "./validation"

export default resolver.pipe(resolver.zod(CreateGame), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  // check if game already created today
  //const game = await db.game.findFirst({ where: {} })

  const game = await db.game.create({ data: input })
  return game
})
