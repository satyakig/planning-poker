import { now, randomId } from './Helpers';
import { Room, User, Vote } from './Models';

export const EVENTS = {
  NEW_USER: 'NEW_USER',
  GET_USER: 'GET_USER',

  JOIN_ROOM: 'JOIN_ROOM',
  NEW_ROOM: 'NEW_ROOM',
  GET_ROOMS: 'GET_ROOMS',

  START_VOTE: 'START_VOTE',
  END_VOTE: 'END_VOTE',
  VOTE: 'VOTE',
  SET_QUESTION: 'SET_QUESTION',

  POKE: 'POKE',
  ERROR: 'ERROR',
};

const DEFAULT_VOTE_TIMEOUT = 5 * 1000;

export class PlanningRooms {
  private static instance: PlanningRooms;

  private USERS: Map<string, User> = new Map();
  private ROOMS: Map<string, Room> = new Map();

  public roomsArr: Room[] = [];

  addNewUser(name: string): User {
    const newUser: User = {
      id: randomId(),
      name,
    };

    this.USERS.set(newUser.id, newUser);

    return newUser;
  }

  addNewRoom(roomName: string, user: User): Room {
    const newRoom: Room = {
      id: randomId(),
      name: roomName,
      users: [],
      lastActive: now(),
      currentQuestion: '',
      voteActive: false,
      voteTimeout: DEFAULT_VOTE_TIMEOUT,
      votes: [],
    };

    this.leaveAndJoin(user, newRoom);
    return newRoom;
  }

  joinNewRoom(room: Room, user: User): void {
    this.leaveAndJoin(user, room);
  }

  getUser(id: string): User | undefined {
    if (!id) {
      return undefined;
    }

    return this.USERS.get(id);
  }

  getRoom(id: string): Room | undefined {
    if (!id) {
      return undefined;
    }

    const room = this.ROOMS.get(id);

    if (room) {
      this.setRooms(room);
    }

    return room;
  }

  isUserInRoom(user: User, room: Room): boolean {
    return (
      room.users.find((roomUser) => {
        return roomUser.id === user.id;
      }) !== undefined
    );
  }

  findRoomForUser(user: User): Room | undefined {
    return this.roomsArr.find((room) => {
      return (
        room.users.find((roomUser) => {
          return roomUser.id === user.id;
        }) !== undefined
      );
    });
  }

  startVote(room: Room): void {
    room.voteActive = true;
    room.votes = [];
    this.setRooms(room);
  }

  endVote(room: Room): void {
    room.voteActive = false;
    this.setRooms(room);
  }

  vote(vote: Vote, room: Room): void {
    let voteUpdated = false;
    for (const roomVote of room.votes) {
      if (roomVote.userId === vote.userId) {
        voteUpdated = true;
        roomVote.value = vote.value;
      }
    }

    if (!voteUpdated) {
      room.votes.push(vote);
    }

    this.setRooms(room);
  }

  setQuestion(room: Room, question: string): void {
    room.currentQuestion = question;
    this.setRooms(room);
  }

  deleteRoom(room: Room): void {
    this.ROOMS.delete(room.id);
    this.roomsArr = Array.from(this.ROOMS.values());
  }

  private leaveAndJoin(user: User, newRoom: Room) {
    for (const room of this.roomsArr) {
      room.users = room.users.filter((roomUser) => {
        return roomUser.id !== user.id;
      });

      this.ROOMS.set(room.id, room);
    }

    newRoom.users.push(user);
    this.setRooms(newRoom);
  }

  private setRooms(room: Room) {
    room.lastActive = now();
    this.ROOMS.set(room.id, room);
    this.roomsArr = Array.from(this.ROOMS.values());
  }

  reset(): void {
    PlanningRooms.instance = new PlanningRooms();
  }

  static getInstance(): PlanningRooms {
    if (PlanningRooms.instance === undefined) {
      PlanningRooms.instance = new PlanningRooms();
    }

    return PlanningRooms.instance;
  }
}
