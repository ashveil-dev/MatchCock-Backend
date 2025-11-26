import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import axios from "@apis"
import { ITournamentData } from "@type/data"

dotenv.config()

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public/"))
app.use(express.urlencoded({ extended: true }))

async function fetchTournamentList(): Promise<ITournamentData[]> {
    const response = await axios.post("mobile_tm_list.php", {
        DATA: JSON.stringify({
            pageStart: 0,
            pageLimit: 10000
        }),
    })

    return response.data.data_list
}

function dateStringToDate(dateString: string) {
    const tempDate = new Date();
    const year = parseInt(dateString.slice(0, 4), 10)
    const month = parseInt(dateString.slice(4, 6), 10)
    const date = parseInt(dateString.slice(6, 8), 10)

    tempDate.setFullYear(year)
    tempDate.setMonth(month)
    tempDate.setDate(date)

    return tempDate
}

app.get("/tournamentList", async (req, res) => {
    const type: "page" | "infinite" = "page"
    const pageNumber: number | undefined = 2
    const cursor: number = 20
    const search: string | undefined = ""
    const stateFilter: string[] | undefined = ["신청", "진행", "완료"] //, "진행", "완료"
    const dateFilter: { from?: Date, to?: Date } | undefined = {
        from: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + + 100 * 24 * 60 * 60 * 1000)
    };
    const order: {
        name?: "asc" | "desc" | undefined,
        date?: "asc" | "desc" | undefined,
        reg?: "asc" | "desc" | undefined,
    } = {
        name: "desc",
        date: "desc",
        reg: "desc"
    }

    // const { nameOrder, dateOrder, regOrder, stateFilter, dateFilter, type, search, cursor } = req.params;

    try {
        let tournamentList = await fetchTournamentList()

        tournamentList = tournamentList
            .filter((tournament) => (
                (tournament.TOURNAMENT_NM !== null && (tournament.TOURNAMENT_NM.search(search) >= 0))
                && (stateFilter !== undefined ? (tournament.STAT_NM !== null && stateFilter.includes(tournament.STAT_NM)) : true)
                && (dateFilter.from !== undefined ? (tournament.TOUR_DATE_FROM !== null && dateFilter.from <= dateStringToDate(tournament.TOUR_DATE_FROM)) : true)
                && (dateFilter.to !== undefined ? (tournament.TOUR_DATE_FROM !== null && dateStringToDate(tournament.TOUR_DATE_FROM) <= dateFilter.to) : true)
            )).sort((a, b) => {
                if (order.name && a.TOURNAMENT_NM && b.TOURNAMENT_NM) {
                    const r = a.TOURNAMENT_NM.localeCompare(b.TOURNAMENT_NM);
                    if (r !== 0) return order.name === "asc" ? r : -r;
                }

                if (order.date && a.TOUR_DATE_FROM && b.TOUR_DATE_FROM) {
                    const r = a.TOUR_DATE_FROM.localeCompare(b.TOUR_DATE_FROM);
                    if (r !== 0) return order.date === "asc" ? r : -r;
                }

                if (order.reg && a.ACCEPT_DATE_FROM && b.ACCEPT_DATE_FROM) {
                    const r = a.ACCEPT_DATE_FROM.localeCompare(b.ACCEPT_DATE_FROM);
                    if (r !== 0) return order.reg === "asc" ? r : -r;
                }

                return 0;
            })
        if (type === "page") {
            if (pageNumber) {
                res.send(tournamentList.slice(10 * (pageNumber - 1), 10 * (pageNumber)))
            }
            res.sendStatus(401)
        }

        // if (type === "infinite") {
        //     if (cursor) {
        //         res.send(tournamentList.slice(cursor, cursor + 10))
        //         return;
        //     }
        // }

        res.send(tournamentList)
    } catch (e) {
        res.sendStatus(500)
    }
})

app.get("/tournamentList", (req, res) => {

})

app.listen(PORT, (error) => {
    console.log(`Example app listening on port ${PORT}`)
})