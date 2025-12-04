import axios from "@apis"

interface IFetchTournament {
    id: string | undefined
}

export default async function  fetchTournament({
    id
}: IFetchTournament): Promise<any> {
    const response = await axios.post("usp_get_entry_list_by_group.php", {
        DATA: JSON.stringify({
            p_tournament_id: id,
            p_group_id: ""
        }),
    })

    return response.data.data_list
}