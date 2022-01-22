import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetGamesInput
  extends Pick<Prisma.GameFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGamesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: games,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.game.count({ where }),
      query: (paginateArgs) => db.game.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      games,
      nextPage,
      hasMore,
      count,
    }
  }
)
