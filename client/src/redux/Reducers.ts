import { AppState, RoomsModel, UserModel } from 'redux/Models';
import { AnyAction } from 'redux';
import { ActionConstants } from 'redux/Actions';
import clone from 'clone';

export function userReducer(state: UserModel = new UserModel(), action: AnyAction): UserModel {
  switch (action.type) {
    case ActionConstants.SET_USER: {
      const model = clone<UserModel>(state);
      model.user = action.user;

      return model;
    }

    case ActionConstants.SET_INITIALIZED: {
      const model = clone<UserModel>(state);
      model.initialized = action.initialized;

      return model;
    }

    default:
      return state;
  }
}

export function roomsReducer(state: RoomsModel = new RoomsModel(), action: AnyAction): RoomsModel {
  switch (action.type) {
    case ActionConstants.SET_ROOMS: {
      return new RoomsModel(action.rooms);
    }

    default:
      return state;
  }
}

export function appStateReducer(state: AppState = new AppState(), action: AnyAction): AppState {
  switch (action.type) {
    case ActionConstants.ERROR: {
      const model = clone<AppState>(state);
      model.error = action.error;

      return model;
    }

    case ActionConstants.TOGGLE_CREATE_ROOM: {
      const model = clone<AppState>(state);
      model.showCreateRoom = action.show;

      return model;
    }

    case ActionConstants.TOGGLE_JOIN_ROOM: {
      const model = clone<AppState>(state);
      model.showJoinRoom = action.show;

      return model;
    }

    default:
      return state;
  }
}
