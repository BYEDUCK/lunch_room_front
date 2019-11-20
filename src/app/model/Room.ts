export class Room {
    constructor(
        public id: string, public name: string, public owner: string, 
        public signDeadline: number, public postDeadline: number, public priorityDeadline: number
        ) { }
}