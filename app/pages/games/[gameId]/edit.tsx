import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGame from "app/games/queries/getGame"
import updateGame from "app/games/mutations/updateGame"
import { GameForm, FORM_ERROR } from "app/games/components/GameForm"

export const EditGame = () => {
  const router = useRouter()
  const gameId = useParam("gameId", "number")
  const [game, { setQueryData }] = useQuery(
    getGame,
    { id: gameId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateGameMutation] = useMutation(updateGame)

  return (
    <>
      <Head>
        <title>Edit Game {game.id}</title>
      </Head>

      <div>
        <h1>Edit Game {game.id}</h1>
        <pre>{JSON.stringify(game, null, 2)}</pre>

        <GameForm
          submitText="Update Game"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateGame}
          initialValues={game}
          onSubmit={async (values) => {
            try {
              const updated = await updateGameMutation({
                id: game.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowGamePage({ gameId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditGamePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditGame />
      </Suspense>

      <p>
        <Link href={Routes.GamesPage()}>
          <a>Games</a>
        </Link>
      </p>
    </div>
  )
}

EditGamePage.authenticate = true
EditGamePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditGamePage
