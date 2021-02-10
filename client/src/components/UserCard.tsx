import React from 'react';
import { Button, CardActions, Typography, CardContent, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { User, VoteValues } from 'redux/Models';
import { UserInfo } from 'lib/UserHook';
import { FindUserVote, RoomInfo } from 'lib/RoomHooks';

type UserCardProps = {
  roomUser: User;
};

const useStyles = makeStyles({
  card: {
    margin: '25px',
    width: 180,
    height: 150,
    textAlign: 'center',
    userSelect: 'none',
  },
});

function UserCard(props: UserCardProps) {
  const classes = useStyles();
  const { user, validUser } = UserInfo();
  const selectedRoom = RoomInfo();
  const userVote = FindUserVote(props.roomUser);

  const disabled = !validUser || !selectedRoom;

  let voteValue: string | number = '';

  if (selectedRoom) {
    if (selectedRoom.voteActive) {
      if (VoteValues.includes(userVote)) {
        voteValue = 'Voted';
      } else {
        voteValue = 'Waiting on vote';
      }
    } else {
      voteValue = userVote;
    }
  }

  return (
    <Card variant="outlined" elevation={10} className={classes.card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom={true}>
          {props.roomUser.name}
        </Typography>
        <Typography variant="h6">{voteValue}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          fullWidth={true}
          disabled={disabled || props.roomUser.id === user.id}
        >
          Poke
        </Button>
      </CardActions>
    </Card>
  );
}

export default React.memo(UserCard);
