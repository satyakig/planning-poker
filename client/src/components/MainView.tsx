import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
import { RoomInfo } from 'lib/RoomHooks';
import Footer from 'components/Footer';
import UserCard from 'components/UserCard';
import { UserInfo } from 'lib/UserHook';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { useDispatch } from 'react-redux';
import { setQuestionAction } from 'redux/Actions';

const useStyles = makeStyles(() => {
  return createStyles({
    mainView: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '10px',
      height: '100%',
    },
    questionContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
    },
    question: {
      flexGrow: 0,
      textAlign: 'center',
      userSelect: 'none',
      marginRight: '5px',
    },
    grid: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
      overflowY: 'auto',
    },
    footer: {
      flexGrow: 0,
      marginBottom: 10,
    },
    joinRoom: {
      height: '100%',
      verticalAlign: 'center',
    },
  });
});

function MainVew() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const selectedRoom = RoomInfo();
  const { validUser } = UserInfo();

  function edit() {
    dispatch(setQuestionAction(true));
  }

  if (selectedRoom && validUser) {
    return (
      <div className={classes.mainView}>
        <div className={classes.questionContainer}>
          <Typography className={classes.question} variant="h6">
            Viewing {selectedRoom.currentQuestion || '??'}
          </Typography>
          <IconButton size="small" color="inherit" onClick={edit}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </div>

        <div className={classes.grid}>
          {selectedRoom.users.map((userRoom) => {
            return <UserCard roomUser={userRoom} key={userRoom.id} />;
          })}
        </div>
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
    );
  }

  return <div className={classes.mainView} />;
}

export default MainVew;
