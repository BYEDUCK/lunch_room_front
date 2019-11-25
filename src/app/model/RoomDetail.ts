import { RoomUser } from './RoomUser';

export class RoomDetail {
    constructor(
        public id: string, public name: string, public owner: string,
        public signDeadline: number, public postDeadline: number, public voteDeadline: number,
        public users: RoomUser[]
    ) {

    }
}