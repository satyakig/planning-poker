import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { Socket } from 'lib/Socket';
import { UserInfo } from 'lib/UserHook';
import { setJoinRoomAction } from 'redux/Actions';

function JoinRoomDialog() {
  const dispatch = useDispatch();

  const show = useSelector((state: ReduxState) => {
    return state.appStateReducer.showJoinRoom;
  });

  const { user } = UserInfo();

  const [roomId, setRoomId] = useState('');

  function hideJoinRoom() {
    dispatch(setJoinRoomAction(false));
  }

  function submit() {
    Socket.getInstance().joinRoom(roomId, user);
    hideJoinRoom();
  }

  return (
    <Dialog
      open={show}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
      fullWidth={true}
      onClose={hideJoinRoom}
    >
      <DialogTitle>Join Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          label="Room Id"
          fullWidth={true}
          color="secondary"
          value={roomId}
          onChange={(event) => {
            setRoomId(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submit} color="secondary" disabled={!roomId}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default JoinRoomDialog;
