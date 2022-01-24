import { resolver, NotFoundError } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id }) => {
  const game = await db.magicNumber.findFirst({ where: { createdDate: new Date() } })
  if (!game) throw new NotFoundError()

  return game
})
