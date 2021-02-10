import React from 'react';
import {
  List,
  ListItem,
  Paper,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import PersonOutlineRoundedIcon from '@material-ui/icons/PersonOutlineRounded';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import { UserInfo } from 'lib/UserHook';
import { useDispatch } from 'react-redux';
import { setCreateRoomAction, setJoinRoomAction } from 'redux/Actions';
import { RoomInfo, RoomsInfo } from 'lib/RoomHooks';
import { Room } from 'redux/Models';
import { Socket } from 'lib/Socket';

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    title: {
      '& p': {
        textTransform: 'uppercase',
        letterSpacing: '2px',
        userSelect: 'none',
        fontWeight: 'bolder',
        textAlign: 'center',
      },
    },
    noSelect: {
      '& span': {
        userSelect: 'none',
      },
      '& p': {
        userSelect: 'text',
      },
    },
    rooms: {
      '& p': {
        textTransform: 'uppercase',
        letterSpacing: '2px',
        userSelect: 'none',
        textAlign: 'center',
      },
    },
    roomList: {
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
  });
});

function Sidebar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, validUser } = UserInfo();
  const rooms = RoomsInfo();
  const selectedRoom = RoomInfo();

  function roomOnClick(room: Room) {
    return () => {
      Socket.getInstance().joinRoom(room.id, user);
    };
  }

  function showJoinRoom() {
    dispatch(setJoinRoomAction(true));
  }

  function showCreateRoom() {
    dispatch(setCreateRoomAction(true));
  }

  return (
    <Paper elevation={4} className={classes.root}>
      <List component="nav">
        <ListItem>
          <ListItemText secondary="Planning Poker" className={classes.title} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PersonOutlineRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={user.name} secondary={user.id} className={classes.noSelect} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <RoomOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={selectedRoom?.name}
            secondary={selectedRoom?.id}
            className={classes.noSelect}
          />
        </ListItem>
        <ListItem>
          <Button variant="contained" fullWidth={true} disabled={!validUser} onClick={showJoinRoom}>
            Join Room
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            fullWidth={true}
            color="primary"
            disabled={!validUser}
            onClick={showCreateRoom}
          >
            Create Room
          </Button>
        </ListItem>
      </List>
      <Divider />

      <div className={classes.roomList}>
        <ListItem>
          <ListItemText secondary="Rooms" className={classes.rooms} />
        </ListItem>
        {rooms.map((room) => {
          return (
            <ListItem
              button={true}
              key={room.id}
              onClick={roomOnClick(room)}
              disabled={!validUser || selectedRoom?.id === room.id}
            >
              <ListItemText primary={room.name} />
            </ListItem>
          );
        })}
      </div>
    </Paper>
  );
}

export default Sidebar;
