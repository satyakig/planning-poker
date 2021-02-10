import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { Socket } from 'lib/Socket';
import { UserInfo } from 'lib/UserHook';
import { setQuestionAction } from 'redux/Actions';
import { RoomInfo } from 'lib/RoomHooks';
import { Room } from 'redux/Models';

function SetQuestionDialog() {
  const dispatch = useDispatch();

  const show = useSelector((state: ReduxState) => {
    return state.appStateReducer.showSetQuestion;
  });

  const { user } = UserInfo();
  const selectedRoom = RoomInfo();

  const [question, setQuestion] = useState('');

  function hideSetQuestion() {
    setQuestion('');
    dispatch(setQuestionAction(false));
  }

  function submit() {
    Socket.getInstance().setQuestion(selectedRoom as Room, user, question);
    hideSetQuestion();
  }

  return (
    <Dialog
      open={show}
      disableBackdropClick={false}
      disableEscapeKeyDown={false}
      fullWidth={true}
      onClose={hideSetQuestion}
    >
      <DialogTitle>Set Topic</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          label="Topic"
          fullWidth={true}
          color="secondary"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={submit} color="secondary" disabled={!question}>
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SetQuestionDialog;
