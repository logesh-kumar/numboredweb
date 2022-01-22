import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGames from "app/games/queries/getGames"
import { GameGrid } from "app/games/components/GameGrid"

const ITEMS_PER_PAGE = 100

export const GamesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ games, hasMore }] = usePaginatedQuery(getGames, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={Routes.ShowGamePage({ gameId: game.id })}>
              <a>{game.text}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const GamesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Games</title>
      </Head>

      <div>
        <GameGrid />
        {/* <p>
          <Link href={Routes.NewGamePage()}>
            <a>Create Game</a>
          </Link>
        </p> */}
        {/* <Suspense fallback={<div>Loading...</div>}>
          <GamesList />
        </Suspense> */}
      </div>
    </>
  )
}

GamesPage.authenticate = true
GamesPage.getLayout = (page) => <Layout>{page}</Layout>

export default GamesPage
