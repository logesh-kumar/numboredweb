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
  const { elapsedTime } = useElapsedTime({ isPlaying })
  const [randomNumber, setRandomNumber] = useState(0)
  const randomNumberSum = randomNumber
    .toString()
    .split("")
    .map((a) => parseInt(a))
    .reduce((a, b) => a + b)

  const [answer, setAnswer] = useState(["", "", "", "", ""])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gameStatus, setGameStaus] = useState<"inprogress" | "wrong" | "right">("inprogress")

  const handleNumberClick = (input) => {
    setIsPlaying(true)
    if (currentIndex <= 5 && answer.indexOf(input) === -1) {
      setCurrentIndex((prev) => prev + 1)
      let newans = [...answer]
      newans[currentIndex] = input
      setAnswer(newans)
    }
  }

  const checkAnswer = () => {
    const res: any = answer.reduce((a, b) => a + b)
    if (res === randomNumberSum) {
      setIsPlaying(false)
    }
    setGameStaus(res === randomNumberSum ? "right" : "wrong")
  }

  const handleDelete = () => {
    let newans = [...answer]
    newans[currentIndex - 1] = ""
    setCurrentIndex((prev) => prev - 1)
    setAnswer(newans)
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
      <h1>You magic number today is {randomNumber}</h1>
      <h2>Random number sum: {randomNumberSum}</h2>
      <div className="pt-4 grid grid-cols-6 gap-4">
        {answer.map((a: string, index) => (
          <GridItem
            key={index}
            borderColor={`${
              gameStatus === "inprogress"
                ? "border-grey-500/100"
                : gameStatus === "right"
                ? "border-green-500/100"
                : "border-red-500/100"
            }`}
          >
            <span>{a}</span>
          </GridItem>
        ))}
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
