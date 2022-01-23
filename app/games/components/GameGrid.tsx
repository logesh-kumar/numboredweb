import React, { useEffect, useState } from "react"
import { TiBackspaceOutline } from "react-icons/ti"
import { GrReturn } from "react-icons/gr"
import { useElapsedTime } from "use-elapsed-time"

const GridItem: React.FC<{
  borderColor: string
  onClick?: () => void
}> = ({ children, borderColor, onClick = () => {} }) => (
  <div
    onClick={onClick}
    className={`flex font-medium items-center justify-center w-14 h-14 border-2 ${borderColor} cursor-pointer select-none`}
  >
    {children}
  </div>
)

export const GameGrid: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [randomNumber, setRandomNumber] = useState(0)

  const { elapsedTime } = useElapsedTime({ isPlaying })
  const randomNumberSum = randomNumber
    .toString()
    .split("")
    .map((a) => parseInt(a))
    .reduce((a, b) => a + b)

  const [answer, setAnswer] = useState({
    1: ["", "", "", "", ""],
    2: ["", "", "", "", ""],
    3: ["", "", "", "", ""],
    4: ["", "", "", "", ""],
    5: ["", "", "", "", ""],
  })

  const [currentIndex, setCurrentIndex] = useState({
    attempt: 1,
    index: -1,
  })

  const [gameStatus, setGameStaus] = useState<{
    [key: number]: "inprogress" | "solved" | "failed" | "idle"
  }>({
    1: "inprogress",
    2: "idle",
    3: "idle",
    4: "idle",
    5: "idle",
  })

  const gameOver =
    gameStatus[1] === "solved" ||
    gameStatus[2] === "solved" ||
    gameStatus[3] === "solved" ||
    gameStatus[4] === "solved" ||
    gameStatus[5] === "solved" ||
    gameStatus[5] === "failed"

  const handleNumberClick = (input) => {
    // do not allow user to proceed is game is over
    if (gameOver || currentIndex.index > 3) {
      return false
    }

    if (currentIndex.index < 4) setCurrentIndex((prev) => ({ ...prev, index: prev.index + 1 }))

    if (isPlaying === false && !gameOver) {
      setIsPlaying(true)
    }

    if (currentIndex.index < 5) {
      let newans = {
        ...answer,
        [currentIndex.attempt]: [...answer[currentIndex.attempt]],
      }

      newans[currentIndex.attempt][currentIndex.index + 1] = input

      setAnswer(newans)
    }
  }

  const checkAnswer = () => {
    // do not allow user to delete after the game is over
    if (gameOver) {
      return false
    }

    // check if all cells are filled for the current attempt
    if (typeof answer[currentIndex.attempt][4] !== "number") {
      return false
    }

    const res: any = answer[currentIndex.attempt].reduce((a, b) => a + b)
    if (res === randomNumberSum) {
      setIsPlaying(false)
    } else {
      if (currentIndex.attempt === 5) {
        setIsPlaying(false)
      }
      setCurrentIndex((prev) => ({ index: -1, attempt: prev.attempt + 1 }))
    }

    setGameStaus({
      ...gameStatus,
      [currentIndex.attempt]: res === randomNumberSum ? "solved" : "failed",
    })
  }

  const handleDelete = () => {
    // do not allow user to delete after the game is over
    if (gameOver) {
      return false
    }

    if (currentIndex.index >= 0) {
      let newans = {
        ...answer,
        [currentIndex.attempt]: [...answer[currentIndex.attempt]],
      }
      newans[currentIndex.attempt][currentIndex.index] = ""
      setAnswer(newans)
      setCurrentIndex((prev) => ({ ...prev, index: prev.index - 1 }))
    }
  }

  useEffect(() => {
    function generateRandomNumber() {
      const random = Math.round(Math.random() * (90000 - 12345) + 12345)
      const randomUnique = new Set(random.toString().split(""))
      if (randomUnique.size === 5) {
        setRandomNumber(random)
      } else {
        generateRandomNumber()
      }
    }
    generateRandomNumber()
  }, [])

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl pt-1">{`Today's magic number is ${randomNumberSum}`}</h2>
      <div className="mt-2 font-bold">
        <span>{gameStatus === "right" ? "Completed in" : "Time elapsed"}:</span>{" "}
        <span>{elapsedTime.toFixed(2)}</span> <span> Seconds</span>
      </div>
      {/* {gameOver && <h2 className="text-2xl pt-4">GAME OVER</h2>} */}
      <div className="flex flex-col justify-center items-center">
        <div className="w-350">
          {Object.keys(answer).map((attempt) => {
            return (
              <div key={attempt} className="flex items-center justify-center">
                {
                  <div className={`pt-2 grid grid-cols-5 gap-2`}>
                    {answer[attempt].map((a: string, index) => (
                      <GridItem
                        key={`${attempt}${index}`}
                        borderColor={`${
                          ["inprogress", "idle"].includes(gameStatus[attempt])
                            ? "border-grey-500/100"
                            : gameStatus[attempt] === "solved"
                            ? "border-green-500/100"
                            : "border-red-500/100"
                        }`}
                      >
                        <span>{a}</span>
                      </GridItem>
                    ))}
                    {/* <GridItem borderColor={"border-white"}>
                    <span>A{attempt}</span>
                  </GridItem> */}
                  </div>
                }
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="pt-6 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((a: number, index) => (
            <div
              onClick={() => handleNumberClick(a)}
              key={a}
              className={`flex font-medium items-center justify-center h-16 w-10 cursor-pointer bg-gray-200 rounded-md`}
            >
              {a}
            </div>
          ))}
          <div
            onClick={() => checkAnswer()}
            className={`flex items-center justify-center h-16 w-max px-4 cursor-pointer bg-gray-200 rounded-md`}
          >
            <GrReturn />
          </div>
          <div
            onClick={() => handleDelete()}
            className={`flex items-center justify-center h-16 w-max px-4 cursor-pointer bg-gray-200 rounded-md`}
          >
            <TiBackspaceOutline />
          </div>
        </div>
      </div>
    </div>
  )
}
