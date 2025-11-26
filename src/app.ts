import express from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public/"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("Hello")
})

app.listen(PORT, (error) => {
    console.log(`Example app listening on port ${PORT}`)
})