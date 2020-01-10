import { Proposal } from './Proposal';

export class ProposalResponse {
    constructor(public total: number, public proposals: Proposal[]) {
        
    }
}