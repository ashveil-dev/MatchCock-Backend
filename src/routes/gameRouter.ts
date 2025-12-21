import express from "express";
import fetchGameList from "@apis/fetchGameList";

const router = express.Router()

router.get("/list", async (req, res) => {
    const tournamentId = req.query.tournamentId as string | undefined;

    if (tournamentId === undefined || tournamentId === null || tournamentId === "") {
        res.sendStatus(401);
        return;
    }

    try {
        const response = await fetchGameList({ tournamentId })
        return res.send({
            data : {
                gameList : response
            }
        })
    } catch (e) {
        return res.sendStatus(401);
    }
})

export default router;