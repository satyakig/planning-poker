import { AnyAction } from 'redux';
import { Room, User } from 'redux/Models';

export const ActionConstants = {
  SET_USER: 'SET_USER',
  SET_INITIALIZED: 'SET_INITIALIZED',

  SET_ROOMS: 'SET_ROOMS',

  ERROR: 'ERROR',
  TOGGLE_CREATE_ROOM: 'TOGGLE_CREATE_ROOM',
  TOGGLE_JOIN_ROOM: 'TOGGLE_JOIN_ROOM',
};

export function setUserAction(user: User): AnyAction {
  return {
    type: ActionConstants.SET_USER,
    user,
  };
}

export function setInitializedAction(initialized: boolean): AnyAction {
  return {
    type: ActionConstants.SET_INITIALIZED,
    initialized,
  };
}

export function setRoomsActions(rooms: Room[]): AnyAction {
  return {
    type: ActionConstants.SET_ROOMS,
    rooms,
  };
}

export function setErrorAction(error: string): AnyAction {
  return {
    type: ActionConstants.ERROR,
    error,
  };
}

export function setCreateRoomAction(show: boolean): AnyAction {
  return {
    type: ActionConstants.TOGGLE_CREATE_ROOM,
    show,
  };
}

export function setJoinRoomAction(show: boolean): AnyAction {
  return {
    type: ActionConstants.TOGGLE_JOIN_ROOM,
    show,
  };
}
