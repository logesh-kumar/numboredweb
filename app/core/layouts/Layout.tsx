import { Leaderboard } from "app/games/components/Leaderboard"
import { Head, BlitzLayout } from "blitz"
import { Suspense } from "react"
import { MdLogout } from "react-icons/md"
import { BsInfoSquare } from "react-icons/bs"
import { Logout } from "../components/Logout"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "numboredweb"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-max-500 m-auto">
        <header className="flex items-center justify-around">
          <BsInfoSquare />

          <h1 className="text-4xl font-semibold py-2">NUMBORED</h1>
          <div className="flex justify-between items-end">
            <Suspense fallback="Loading...">
              <Leaderboard />
            </Suspense>
            <Suspense fallback="Loading...">
              <Logout />
            </Suspense>
          </div>
        </header>
        <hr />
        <main role="main">{children}</main>
      </div>
    </>
  )
}

export default Layout
