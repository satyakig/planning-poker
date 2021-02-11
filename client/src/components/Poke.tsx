import React, { useEffect, useRef, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
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
  const audioRef = useRef<null | HTMLAudioElement>(null);
  const { user, validUser } = UserInfo();
  const [options, setOptions] = useState({
    show: false,
    from: '',
  });

  const poke = useSelector((state: ReduxState) => {
    return state.appStateReducer.poke;
  });

  function hide() {
    setOptions({
      show: false,
      from: '',
    });
  }

  useEffect(() => {
    if (poke !== null) {
      console.log(poke);
    }

    if (poke !== null && poke.to.id === user.id && validUser) {
      setOptions({
        show: true,
        from: poke.from.name,
      });
    }
  }, [poke, user.id, validUser]);

  useEffect(() => {
    if (options.show) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      try {
        const index = Math.floor(Math.random() * Math.floor(2));

        const el = new Audio(`./${audios[index]}.mp3`);
        el.play().then().catch();
        audioRef.current = el;
      } catch (err) {}
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [options.show]);

  return (
    <Snackbar
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
      open={options.show}
      onClose={hide}
      autoHideDuration={2500}
      message={`poke - ${poke?.from.name}`}
      className={classes.content}
    />
  );
}

export default Notification;
