import React, { useEffect, useState } from "react"
import { TiBackspaceOutline } from "react-icons/ti"
import { GrReturn } from "react-icons/gr"
import { useElapsedTime } from "use-elapsed-time"
import { useMutation } from "blitz"
import getMagicNumber from "../queries/getMagicNumber"
import { invoke } from "blitz"
import createGame from "../mutations/createGame"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

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
  const user = useCurrentUser()
  const [isPlaying, setIsPlaying] = useState(false)
  const [{ magicNumber, id: magicNumberId }, setRandomNumber] = useState({ id: 0, magicNumber: 0 })
  const { elapsedTime } = useElapsedTime({ isPlaying })

  const [answer, setAnswer] = useState({
    1: ["", "", "", "", ""],
    2: ["", "", "", "", ""],
    3: ["", "", "", "", ""],
    4: ["", "", "", "", ""],
    5: ["", "", "", "", ""],
  })

  const [currentAttempt, setCurrentAttempt] = useState({
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
    if (gameOver || currentAttempt.index > 3) {
      return false
    }

    //check if number already exists
    if (answer[currentAttempt.attempt].indexOf(input) !== -1) {
      return false
    }

    if (currentAttempt.index < 4) setCurrentAttempt((prev) => ({ ...prev, index: prev.index + 1 }))

    if (isPlaying === false && !gameOver) {
      setIsPlaying(true)
    }

    if (currentAttempt.index < 5) {
      let newans = {
        ...answer,
        [currentAttempt.attempt]: [...answer[currentAttempt.attempt]],
      }

      newans[currentAttempt.attempt][currentAttempt.index + 1] = input

      setAnswer(newans)
    }
  }

  const [createGameMutation] = useMutation(createGame)

  const checkAnswer = async () => {
    // do not allow user to delete after the game is over
    if (gameOver) {
      return false
    }

    // check if all cells are filled for the current attempt
    if (typeof answer[currentAttempt.attempt][4] !== "number") {
      return false
    }

    const res: any = answer[currentAttempt.attempt].reduce((a, b) => a + b)
    if (res === magicNumber) {
      setIsPlaying(false)
      try {
        await createGameMutation({
          duration: elapsedTime,
          magicNumberId,
          score: 0,
          userId: user!.id,
          attempt: currentAttempt.attempt,
        })
      } catch (error) {
        throw new Error(error)
      }
    } else {
      if (currentAttempt.attempt === 5) {
        setIsPlaying(false)
      }
      setCurrentAttempt((prev) => ({ index: -1, attempt: prev.attempt + 1 }))
    }

    setGameStaus({
      ...gameStatus,
      [currentAttempt.attempt]: res === magicNumber ? "solved" : "failed",
    })
  }

  const handleDelete = () => {
    // do not allow user to delete after the game is over
    if (gameOver) {
      return false
    }

    if (currentAttempt.index >= 0) {
      let newans = {
        ...answer,
        [currentAttempt.attempt]: [...answer[currentAttempt.attempt]],
      }
      newans[currentAttempt.attempt][currentAttempt.index] = ""
      setAnswer(newans)
      setCurrentAttempt((prev) => ({ ...prev, index: prev.index - 1 }))
    }
  }

  // Prefetch todays random number on load
  useEffect(() => {
    invoke(getMagicNumber, {})
      .then((data) => {
        setRandomNumber({ id: data.id, magicNumber: data.magicNumber })
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-2xl pt-1">{`Today's magic number is ${magicNumber}`}</h2>
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
