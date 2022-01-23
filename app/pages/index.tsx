import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { GameGrid } from "app/games/components/GameGrid"
import createGame from "app/games/mutations/createGame"
import { BlitzPage, useMutation, useQuery } from "blitz"
import { Suspense, useEffect } from "react"

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
