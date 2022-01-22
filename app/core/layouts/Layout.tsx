import { Head, BlitzLayout } from "blitz"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "numboredweb"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <main role="main" className="w-full mt-4">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout
