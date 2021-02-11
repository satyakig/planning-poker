import React from 'react';
import { mean, median } from 'mathjs';
import { FindUserVote, RoomInfo } from 'lib/RoomHooks';
import { UserInfo } from 'lib/UserHook';
import { Button, Grid, Typography } from '@material-ui/core';
import { Room, VoteValues } from 'redux/Models';
import { Socket } from 'lib/Socket';

function Footer() {
  const { user, validUser } = UserInfo();
  const selectedRoom = RoomInfo();
  const userVote = FindUserVote(user);

  const disabled = !validUser || !selectedRoom;

  function startVote() {
    Socket.getInstance().startVote(selectedRoom as Room, user);
  }

  function endVote() {
    Socket.getInstance().endVote(selectedRoom as Room, user);
  }

  function sendVote(value: string | number) {
    return () => {
      Socket.getInstance().vote(selectedRoom as Room, { userId: user.id, value });
    };
  }

  function generateCalcs() {
    if (selectedRoom && selectedRoom.votes.length > 0 && !selectedRoom.voteActive) {
      const votes = selectedRoom.votes
        .filter((vote) => {
          return typeof vote.value === 'number';
        })
        .map((vote) => {
          return Number(vote.value);
        });

      if (votes.length > 0) {
        return (
          <React.Fragment>
            <Grid item={true} xs={3}>
              <Typography align="center">Min: {Math.min(...votes).toFixed(1)}</Typography>
            </Grid>
            <Grid item={true} xs={3}>
              <Typography align="center">Mean: {mean(votes).toFixed(1)}</Typography>
            </Grid>
            <Grid item={true} xs={3}>
              <Typography align="center">Median: {median(votes).toFixed(1)}</Typography>
            </Grid>
            <Grid item={true} xs={3}>
              <Typography align="center">Max: {Math.max(...votes).toFixed(1)}</Typography>
            </Grid>
          </React.Fragment>
        );
      }
    }

    return null;
  }

  if (!selectedRoom) {
    return <div />;
  }

  return (
    <Grid container={true} spacing={2} alignContent="center" justify="space-around">
      {generateCalcs()}
      <Grid item={true} xs={6}>
        <Button
          variant="contained"
          fullWidth={true}
          color="primary"
          onClick={startVote}
          disabled={disabled || selectedRoom.voteActive}
        >
          Start Vote
        </Button>
      </Grid>
      <Grid item={true} xs={6}>
        <Button
          variant="contained"
          fullWidth={true}
          onClick={endVote}
          disabled={disabled || !selectedRoom.voteActive}
        >
          End Vote
        </Button>
      </Grid>
      {VoteValues.map((val) => {
        const doesVoteMatch = userVote === val;

        return (
          <Grid item={true} xs={2} key={val}>
            <Button
              variant="contained"
              fullWidth={true}
              onClick={sendVote(val)}
              disabled={disabled || !selectedRoom.voteActive}
              color={doesVoteMatch ? 'primary' : undefined}
            >
              {val}
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default React.memo(Footer);
