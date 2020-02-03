export class Room {
    constructor(
        public roomId: string,
        public roomName: string,
        public ownerId: string,
        public initialDeadline: number,
        public voteDeadline: number,
        open: boolean
    ) { }
}