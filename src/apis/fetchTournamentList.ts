import axios from "@apis"
import { ITournamentData } from "@type/data"

export default async function fetchTournamentList(): Promise<ITournamentData[]> {
    const response = await axios.post("mobile_tm_list.php", {
        DATA: JSON.stringify({
            pageStart: 0,
            pageLimit: 10000
        }),
    })

    return response.data.data_list
}