import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createGame from "app/games/mutations/createGame"
import { GameForm, FORM_ERROR } from "app/games/components/GameForm"

const NewGamePage: BlitzPage = () => {
  const router = useRouter()
  const [createGameMutation] = useMutation(createGame)

  return (
    <div>
      <h1>Create New Game</h1>

      <GameForm
        submitText="Create Game"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateGame}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const game = await createGameMutation(values)
            router.push(Routes.ShowGamePage({ gameId: game.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.GamesPage()}>
          <a>Games</a>
        </Link>
      </p>
    </div>
  )
}

NewGamePage.authenticate = true
NewGamePage.getLayout = (page) => <Layout title={"Create New Game"}>{page}</Layout>

export default NewGamePage
