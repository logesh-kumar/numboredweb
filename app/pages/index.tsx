import Layout from "app/core/layouts/Layout"
import { GameGrid } from "app/games/components/GameGrid"
import { BlitzPage } from "blitz"

const GamesPage: BlitzPage = () => {
  return <GameGrid />
}

//GamesPage.authenticate = true
GamesPage.getLayout = (page) => <Layout>{page}</Layout>

export default GamesPage
