import { MenuItem } from './MenuItem';

export class Proposal {

    constructor(
        public proposalId: string,
        public title: string,
        public menuUrl: string,
        public menuItems: MenuItem[],
        public proposalOwnerId: string,
        public ratingSum: number,
        public votesCount: number
    ) {
    }
}