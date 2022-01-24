import Layout from "app/core/layouts/Layout"
import { GameGrid } from "app/games/components/GameGrid"
import { BlitzPage, useQuery } from "blitz"
import { Suspense } from "react"

const GamesPage: BlitzPage = () => {
  return (
    <Suspense fallback="Loading...">
      <GameGrid />
    </Suspense>
  )
}

GamesPage.authenticate = true
GamesPage.getLayout = (page) => <Layout>{page}</Layout>

export default GamesPage
