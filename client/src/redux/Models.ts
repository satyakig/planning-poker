export const VoteValues = [1, 2, 3, 5, 8, '?'];

export type User = {
  id: string;
  name: string;
};

export type Vote = {
  value: string | number;
  userId: string;
};

export type Room = {
  id: string;
  name: string;
  users: User[];
  lastActive: number;
  currentQuestion: string;
  voteActive: boolean;
  voteTimeout: number;
  votes: Vote[];
};

export class UserModel {
  user: User;
  initialized: boolean;

  constructor() {
    this.user = {
      id: '',
      name: '',
    };
    this.initialized = false;
  }
}

export class RoomsModel {
  rooms: Map<string, Room>;

  constructor(rooms: Room[] = []) {
    this.rooms = new Map();

    rooms.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    for (const room of rooms) {
      room.users.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      this.rooms.set(room.id, room);
    }
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export class AppState {
  error: string;
  showCreateRoom: boolean;
  showJoinRoom: boolean;
  showSetQuestion: boolean;
  poke: User | null;

  constructor() {
    this.error = '';
    this.showCreateRoom = false;
    this.showJoinRoom = false;
    this.showSetQuestion = false;
    this.poke = null;
  }
}
