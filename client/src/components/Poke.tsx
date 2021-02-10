import React from 'react';
import { Snackbar } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { setPokeAction } from 'redux/Actions';
import { UserInfo } from 'lib/UserHook';

const useStyles = makeStyles(() => {
  return createStyles({
    content: {
      '& .MuiSnackbarContent-root': {
        width: 'fit-content',
        minWidth: 0,
        userSelect: 'none',
        fontWeight: 'bold',
      },
    },
  });
});

const audios = ['chewbacka', 'babyCrying'];

function Notification() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const poke = useSelector((state: ReduxState) => {
    return state.appStateReducer.poke;
  });

  const { user, validUser } = UserInfo();

  function hide() {
    dispatch(setPokeAction(null));
  }

  const open = poke !== null && poke.id === user.id && validUser;

  if (open) {
    const index = Math.floor(Math.random() * Math.floor(2));

    try {
      new Audio(`./${audios[index]}.mp3`).play().then().catch();
    } catch (err) {}
  }

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
      open={open}
      onClose={hide}
      message="poke"
      className={classes.content}
    />
  );
}

export default Notification;
