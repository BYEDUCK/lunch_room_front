import { MenuItem } from './MenuItem';

export class Proposal {
    constructor(
        public proposalId: string, public title: string, public menuItems: MenuItem[],
        public ratingSum: number, public votesCount: number
    ) {
    }
}