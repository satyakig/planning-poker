import React from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { setErrorAction } from 'redux/Actions';

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
        vertical: 'top',
        horizontal: 'center',
      }}
      open={error.length > 0 && initialized}
      autoHideDuration={7500}
      onClose={hide}
      message={error}
      action={
        <IconButton size="small" color="inherit" onClick={hide}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

export default Notification;
