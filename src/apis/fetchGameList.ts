import axios from "@apis";
import { AxiosError } from "axios";

interface IFetchGameList {
    tournamentId: string,
   
}

async function fetchGameList({ tournamentId }: IFetchGameList) {
    const data = {
        p_tournament_id: "TM_20251017192547",
        TOURNAMENT_ID: "TM_20251017192547",
        p_event_id: "",
        p_court_no: "0",
        p_plan_date: "",
        p_gym_cd: "",
        p_match_sts: "11",
        p_div: "T",
    }

    try {
        const response = await axios.post("mobile_usp_match_all_list_order.php", {
            DATA : JSON.stringify(data)
        })

        return response.data
    } catch (e) {
        if (e instanceof AxiosError) {
            throw new Error(e.message)
        }

        throw new Error("알 수 없는 에러가 발생했습니다")
    }
}

export default fetchGameList;