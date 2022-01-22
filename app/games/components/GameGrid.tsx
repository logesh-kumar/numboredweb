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
    className={`flex font-medium items-center justify-center w-14 h-14 border-4 ${borderColor} cursor-pointer`}
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
  })

  const [currentIndex, setCurrentIndex] = useState({
    attempt: 1,
    index: 0,
  })

  const [gameStatus, setGameStaus] = useState<{
    [key: number]: "inprogress" | "solved" | "failed" | "idle"
  }>({
    1: "inprogress",
    2: "idle",
    3: "idle",
  })

  const gameOver =
    gameStatus[1] === "solved" ||
    gameStatus[2] === "solved" ||
    gameStatus[3] === "solved" ||
    gameStatus[3] === "failed"

  const handleNumberClick = (input) => {
    if (isPlaying === false) {
      setIsPlaying(true)
    }

    if (currentIndex.index <= 5 && answer[currentIndex.attempt].indexOf(input) === -1) {
      setCurrentIndex((prev) => ({ ...prev, index: prev.index + 1 }))
      let newans = {
        ...answer,
        [currentIndex.attempt]: [...answer[currentIndex.attempt]],
      }
      newans[currentIndex.attempt][currentIndex.index] = input
      setAnswer(newans)
    }
  }

  const checkAnswer = () => {
    const res: any = answer[currentIndex.attempt].reduce((a, b) => a + b)
    if (res === randomNumberSum) {
      setIsPlaying(false)
    } else {
      setCurrentIndex((prev) => ({ index: 0, attempt: prev.attempt + 1 }))
    }

    setGameStaus({
      ...gameStatus,
      [currentIndex.attempt]: res === randomNumberSum ? "solved" : "failed",
    })
  }

  const handleDelete = () => {
    if (currentIndex.index > 0) {
      let newans = {
        ...answer,
        [currentIndex.attempt]: [...answer[currentIndex.attempt]],
      }
      newans[currentIndex.attempt][currentIndex.index - 1] = ""
      setCurrentIndex((prev) => ({ ...prev, index: prev.index - 1 }))
      setAnswer(newans)
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
    <div className="w-max m-auto">
      <h1 className="text-4xl pt-8">{`Today's magic number is ${randomNumber}`}</h1>
      <h2 className="text-2xl pt-4">Sum: {randomNumberSum}</h2>
      {gameOver && <h2 className="text-2xl pt-4">GAME OVER</h2>}

      <div>
        {Object.keys(answer).map((attempt) => {
          return (
            <div key={attempt} className="flex items-center">
              {
                <div className={`pt-4 grid grid-cols-6 gap-4 opacity-100`}>
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
                  <GridItem borderColor={"border-white"}>
                    <span>A{attempt}</span>
                  </GridItem>
                </div>
              }
            </div>
          )
        })}
      </div>
      <div className="pt-10 grid grid-cols-10 gap-4">
        {Array.from({ length: 10 }).map((a: number, index) => (
          <div
            onClick={() => handleNumberClick(index)}
            key={index}
            className={`flex font-medium items-center justify-center h-16 w-10 cursor-pointer bg-gray-200 rounded-md`}
          >
            {index.toString()}
          </div>
        ))}
      </div>
      <div className="w-max pt-2 grid grid-cols-2 gap-4">
        <div
          onClick={() => checkAnswer()}
          className={`flex mt-4 items-center justify-center h-10 w-max px-4 cursor-pointer bg-gray-200 rounded-md`}
        >
          <GrReturn />
        </div>
        <div
          onClick={() => handleDelete()}
          className={`flex mt-4 items-center justify-center h-10 w-max px-4 cursor-pointer bg-gray-200 rounded-md`}
        >
          <TiBackspaceOutline />
        </div>
      </div>
      <div className="mt-8 font-bold">
        <span>{gameStatus === "right" ? "Completed in" : "Time elapsed"}:</span>{" "}
        <span>{elapsedTime.toFixed(2)}</span> <span> Seconds</span>
      </div>
    </div>
  )
}
