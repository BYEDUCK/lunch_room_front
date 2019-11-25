export class RoomSimple {
    constructor(
        public roomId: string, public roomName: string, 
        public signDeadline: number, public postDeadline: number, public voteDeadline: number
        ) { }
}