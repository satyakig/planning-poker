import React from 'react';
import { createStyles, makeStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';
import { RoomInfo } from 'lib/RoomHooks';
import Footer from 'components/Footer';
import UserCard from 'components/UserCard';

const useStyles = makeStyles(() => {
  return createStyles({
    mainView: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '10px',
      height: '100%',
    },
    question: {
      flexGrow: 0,
      textAlign: 'center',
      userSelect: 'none',
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
  const classes = useStyles();
  const selectedRoom = RoomInfo();

  if (selectedRoom) {
    return (
      <div className={classes.mainView}>
        <div className={classes.question}>
          <TextField
            label="Voting on..."
            variant="outlined"
            value={selectedRoom.currentQuestion}
            color="secondary"
            fullWidth={true}
          />
        </div>
        <div className={classes.grid}>
          {selectedRoom.users.map((user) => {
            return <UserCard roomUser={user} key={user.id} />;
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
