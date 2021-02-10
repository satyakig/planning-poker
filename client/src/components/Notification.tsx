import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { setErrorAction } from 'redux/Actions';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="standard" {...props} />;
}

function Notification() {
  const dispatch = useDispatch();
  const error = useSelector((state: ReduxState) => {
    return state.appStateReducer.error;
  });

  const initialized = useSelector((state: ReduxState) => {
    return state.userReducer.initialized;
  });

  function hide() {
    dispatch(setErrorAction(''));
  }

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
      open={error.length > 0 && initialized}
      autoHideDuration={7500}
      onClose={hide}
    >
      <Alert onClose={hide} severity="error" style={{ userSelect: 'none' }}>
        {error.toUpperCase()}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
