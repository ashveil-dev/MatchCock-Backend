import express from "express"
import cors from "cors"
import gameRouter from "@routes/gameRouter"
import tournamentRouter from "@routes/tournmanetRouter"

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public/"))
app.use(express.urlencoded({ extended: true }))
app.use("/tournament", tournamentRouter)
app.use("/game", gameRouter)

app.listen(PORT, "0.0.0.0", (error) => {
    console.log(`Example app listening on port ${PORT}`)
})