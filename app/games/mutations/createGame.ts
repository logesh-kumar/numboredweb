import { resolver } from "blitz"
import db from "db"
import { CreateGame } from "./validation"

export default resolver.pipe(resolver.zod(CreateGame), resolver.authorize(), async (input) => {
  const game = await db.game.create({ data: input })
  return game
})
