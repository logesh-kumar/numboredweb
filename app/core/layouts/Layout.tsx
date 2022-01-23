import { Head, BlitzLayout } from "blitz"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "numboredweb"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-max-500 m-auto">
        <header className="flex items-center justify-center">
          <h1 className="text-4xl font-semibold py-2">NUMBORED</h1>
        </header>
        <hr />
        <main role="main">{children}</main>
      </div>
    </>
  )
}

export default Layout
