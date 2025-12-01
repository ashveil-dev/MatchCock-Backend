import express from "express";
import fetchTournamentList from "apis/fetchTournamentList";
import type { TournamentListBodyType } from "@type/body";
import { ITournamentData } from "@type/data";

const router = express.Router()
let globalTournamentList: undefined | ITournamentData[] = undefined

router.post<{}, any, TournamentListBodyType>("/", async (req, res) => {
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

    const { type, pageNumber, cursor, search, stateFilter, dateFilter, order } = req.body;
    try {
        let tournamentList: undefined | ITournamentData[] = globalTournamentList !== undefined ? globalTournamentList : await fetchTournamentList();

        tournamentList = tournamentList
            .filter((tournament) => (
                (tournament.TOURNAMENT_NM !== null && (tournament.TOURNAMENT_NM.search(search ?? "") >= 0))
                && ((stateFilter !== undefined && stateFilter.length !== 0) ? (tournament.STAT_NM !== null && stateFilter.includes(tournament.STAT_NM)) : true)
                && (dateFilter?.from !== undefined ? (tournament.TOUR_DATE_FROM !== null && dateFilter.from <= dateStringToDate(tournament.TOUR_DATE_FROM)) : true)
                && (dateFilter?.to !== undefined ? (tournament.TOUR_DATE_FROM !== null && dateStringToDate(tournament.TOUR_DATE_FROM) <= dateFilter.to) : true)
            )).sort((a, b) => {
                if (order?.name && a.TOURNAMENT_NM && b.TOURNAMENT_NM) {
                    const r = a.TOURNAMENT_NM.localeCompare(b.TOURNAMENT_NM);
                    if (r !== 0) return order.name === "asc" ? r : -r;
                }

                if (order?.date && a.TOUR_DATE_FROM && b.TOUR_DATE_FROM) {
                    const r = a.TOUR_DATE_FROM.localeCompare(b.TOUR_DATE_FROM);
                    if (r !== 0) return order.date === "asc" ? r : -r;
                }

                if (order?.reg && a.ACCEPT_DATE_FROM && b.ACCEPT_DATE_FROM) {
                    const r = a.ACCEPT_DATE_FROM.localeCompare(b.ACCEPT_DATE_FROM);
                    if (r !== 0) return order.reg === "asc" ? r : -r;
                }

                return 0;
            })

        if (type === "page") {
            if (pageNumber) {
                return res.send({
                    data: {
                        tournamentList: tournamentList.slice(10 * (pageNumber - 1), 10 * (pageNumber)),
                        lastPage: Math.ceil(tournamentList.length / 10)
                    }
                })
            }
            return res.sendStatus(401)
        }

        if (type === "infinite") {
            if (cursor !== undefined) {
                return res.send({
                    data: {
                        tournamentList: tournamentList.slice(cursor, cursor + 10),
                        nextCursor: tournamentList.length > cursor + 10 ? cursor + 11 : null
                    }
                })
            }
        }

        return res.send({
            data : {
                tournamentList
            }
        })
    } catch (e) {
        return res.sendStatus(500)
    }
})

export default router;
