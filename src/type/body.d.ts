export type TournamentListBodyType = {
    type?: "page" | "infinite" | undefined
    pageNumber?: number | undefined,
    cursor?: number | undefined,
    search?: string | undefined,
    stateFilter?: string[] | undefined,
    dateFilter?: {
        from?: Date,
        to?: Date,
    } | undefined,
    order?: {
        [key: string]: "asc" | "desc"
    } | undefined
}