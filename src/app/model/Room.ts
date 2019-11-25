export class Room {
    constructor(
        public roomId: string, public roomName: string, 
        public signDeadline: number, public postDeadline: number, public priorityDeadline: number
        ) { }
}