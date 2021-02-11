import io from 'socket.io-client';
import { AnyAction, Store } from 'redux';
import {
  setErrorAction,
  setInitializedAction,
  setPokeAction,
  setRoomsActions,
  setUserAction,
} from 'redux/Actions';
import { User, Room, Vote, Poke } from 'redux/Models';

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

const userIdKey = 'userId';

export class Socket {
  readonly URL = process.env.REACT_APP_URL;

  private socket: SocketIOClient.Socket;
  private static instance: Socket;
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.socket = io(this.URL);

    this.socket.on('connect', () => {
      this.socket.emit(EVENTS.GET_USER, window.localStorage.getItem(userIdKey) || 'UnknownUser');
    });

    this.socket.on(EVENTS.GET_USER, (user: User | undefined) => {
      this.generateAction(setInitializedAction(true));

      if (user) {
        window.localStorage.setItem(userIdKey, user.id);
        this.generateAction(setUserAction(user));
      }
    });

    this.socket.on(EVENTS.GET_ROOMS, (rooms: Room[]) => {
      this.generateAction(setRoomsActions(rooms));
    });

    this.socket.on(EVENTS.ERROR, (error: string) => {
      if (error.toLowerCase().includes('no user found')) {
        this.generateAction(setUserAction({ id: '', name: '' }));
      } else {
        this.generateAction(setErrorAction(error));
      }
    });

    this.socket.on(EVENTS.POKE, (data: Poke) => {
      this.generateAction(setPokeAction(data));
    });

    this.socket.on('disconnect', () => {
      this.generateAction(setInitializedAction(false));
      this.generateAction(setUserAction({ id: '', name: '' }));
    });
  }

  createUser(name: string) {
    this.socket.emit(EVENTS.NEW_USER, name);
  }

  createRoom(roomName: string, user: User) {
    this.socket.emit(EVENTS.NEW_ROOM, { roomName, user });
  }

  joinRoom(roomId: string, user: User) {
    this.socket.emit(EVENTS.JOIN_ROOM, { roomId, user });
  }

  startVote(room: Room, user: User) {
    this.socket.emit(EVENTS.START_VOTE, { room, user });
  }

  endVote(room: Room, user: User) {
    this.socket.emit(EVENTS.END_VOTE, { room, user });
  }

  vote(room: Room, vote: Vote) {
    this.socket.emit(EVENTS.VOTE, { room, vote });
  }

  setQuestion(room: Room, user: User, question: string) {
    this.socket.emit(EVENTS.SET_QUESTION, { room, user, question });
  }

  poke(thisUser: User, otherUser: User) {
    this.socket.emit(EVENTS.POKE, { thisUser, otherUser });
  }

  private generateAction(action: AnyAction): void {
    this.store.dispatch(action);
  }

  static getInstance(): Socket {
    if (Socket.instance === undefined) {
      throw new Error('Socket instance is undefined');
    }

    return Socket.instance;
  }

  static createInstance(store: Store) {
    Socket.instance = new Socket(store);
  }
}
