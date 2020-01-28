export class SummariesResponse {
    constructor(public summaries: SummaryResponse[]) {
    }
}

export class SummaryResponse {
    constructor(
        public timestamp: number,
        public winnerNick: string,
        public winnerProposalTitle: string
    ) {

    }
}