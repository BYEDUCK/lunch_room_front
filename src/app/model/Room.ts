export class Room {
    constructor(
        public roomId: string, public roomName: string, public ownerId: string,
        public signDeadline: number, public postDeadline: number, public voteDeadline: number
        ) { }
}