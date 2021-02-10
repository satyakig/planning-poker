import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { Socket } from 'lib/Socket';
import { UserInfo } from 'lib/UserHook';
import { setCreateRoomAction } from 'redux/Actions';

function CreateRoomDialog() {
  const dispatch = useDispatch();
  const show = useSelector((state: ReduxState) => {
    return state.appStateReducer.showCreateRoom;
  });

  const { user } = UserInfo();

  const [roomName, setRoomName] = useState('');

  function hideCreateRoom() {
    dispatch(setCreateRoomAction(false));
  }

  function submit() {
    Socket.getInstance().createRoom(roomName, user);
    hideCreateRoom();
  }

  return (
    <Dialog
      open={show}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
      fullWidth={true}
      onClose={hideCreateRoom}
    >
      <DialogTitle>Create Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          label="Room Name"
          fullWidth={true}
          color="secondary"
          value={roomName}
          onChange={(event) => {
            setRoomName(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submit} color="secondary" disabled={!roomName}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateRoomDialog;
