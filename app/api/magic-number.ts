import { getSession, BlitzApiRequest, BlitzApiResponse } from "blitz"
import db from "db"

export default async function customRoute(req: BlitzApiRequest, res: BlitzApiResponse) {
  const session = await getSession(req, res)
  async function generateRandomNumber() {
    const random = Math.round(Math.random() * (90000 - 12345) + 12345)
    const randomUnique = new Set(random.toString().split(""))
    if (randomUnique.size === 5) {
      const randomNumberSum = random
        .toString()
        .split("")
        .map((a) => parseInt(a))
        .reduce((a, b) => a + b)

      const magicNumber = await db.magicNumber.create({
        data: {
          magicNumber: randomNumberSum,
        },
      })
    } else {
      await generateRandomNumber()
    }
  }

  const magicNumber = await db.magicNumber.findFirst({
    where: {
      createdDate: new Date(),
    },
  })

  if (!magicNumber) {
    await generateRandomNumber()
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ userId: session.userId }))
}
