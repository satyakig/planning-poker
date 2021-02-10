import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { Room, User } from 'redux/Models';

function getUserInfo(state: ReduxState) {
  return state.userReducer.user;
}

function getRooms(state: ReduxState) {
  return state.roomsReducer.getAllRooms();
}

function findRoom(user: User, rooms: Room[]) {
  return rooms.find((room) => {
    return (
      room.users.find((roomUser) => {
        return roomUser.id === user.id;
      }) !== undefined
    );
  });
}

const roomSelector = createSelector([getUserInfo, getRooms], findRoom);

export function RoomsInfo() {
  const rooms = useSelector((state: ReduxState) => {
    return state.roomsReducer;
  });

  return useMemo(() => {
    return rooms.getAllRooms();
  }, [rooms]);
}

export function RoomInfo() {
  const selectedRoom = useSelector(roomSelector);

  return useMemo(() => {
    return selectedRoom;
  }, [selectedRoom]);
}

const DNV = 'Did not vote';

export function FindUserVote(user: User) {
  const roomInfo = RoomInfo();

  let val: string | number = DNV;

  if (user && roomInfo) {
    const vote = roomInfo.votes.find((userVote) => {
      return userVote.userId === user.id;
    });

    if (vote) {
      val = vote.value;
    }
  }

  return useMemo(() => {
    return val;
  }, [val]);
}
