import { combineReducers } from 'redux';
import { AppState, RoomsModel, UserModel } from 'redux/Models';
import { userReducer, roomsReducer, appStateReducer } from 'redux/Reducers';

export interface ReduxState {
  userReducer: UserModel;
  roomsReducer: RoomsModel;
  appStateReducer: AppState;
}

const CombinedReducer = combineReducers({
  userReducer,
  roomsReducer,
  appStateReducer,
});

export default CombinedReducer;
