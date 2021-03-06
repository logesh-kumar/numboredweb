import { render } from "test/utils"
import { GameGrid } from "../GameGrid"

describe("Gamegrid", () => {
  test("Loads without any error", async () => {
    const { getByText } = render(<GameGrid />)
    expect(getByText("Today's magic number is", { exact: false })).toBeInTheDocument()
  })
})
