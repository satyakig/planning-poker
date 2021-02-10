import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { Socket } from 'lib/Socket';
import { UserInfo } from 'lib/UserHook';

function NameDialog() {
  const loaded = useSelector((state: ReduxState) => {
    return state.userReducer.initialized;
  });

  const { user } = UserInfo();

  const [name, setName] = useState('');

  function submit() {
    Socket.getInstance().createUser(name);
  }

  return (
    <Dialog
      open={loaded && !user.id}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      fullWidth={true}
    >
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          label="Name"
          autoComplete="name"
          fullWidth={true}
          color="secondary"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submit} color="secondary" disabled={!name}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NameDialog;
