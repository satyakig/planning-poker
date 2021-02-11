import express from 'express';
import { Server as HttpServer } from 'http';
import cors from 'cors';
import util from 'util';
import { Server, Socket } from 'socket.io';
import { EVENTS, PlanningRooms } from './PlanningRooms';
import { Room, VoteValues } from './Models';

const app = express();
app.use(cors());

const httpServer = new HttpServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

function leaveAndJoin(rooms: Room[], newRoom: Room, socket: Socket) {
  for (const room of rooms) {
    socket.leave(room.id);
  }

  socket.join(newRoom.id);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logObject(key: string, object: unknown) {
  console.debug(key, util.inspect(object, { showHidden: false, depth: null }));
}

io.on('connection', (socket: Socket) => {
  socket.on(EVENTS.GET_USER, (id: string) => {
    const user = PlanningRooms.getInstance().getUser(id);

    if (user) {
      const room = PlanningRooms.getInstance().findRoomForUser(user);

      if (room) {
        PlanningRooms.getInstance().joinNewRoom(room, user);
        leaveAndJoin(PlanningRooms.getInstance().roomsArr, room, socket);
      }
    }

    socket.emit(EVENTS.GET_USER, user);
    io.emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.NEW_USER, (name: string) => {
    socket.emit(EVENTS.GET_USER, PlanningRooms.getInstance().addNewUser(name));
  });

  socket.on(EVENTS.GET_ROOMS, () => {
    io.emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.NEW_ROOM, ({ roomName, user }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(user.id);

    if (doesUserExist) {
      const room = PlanningRooms.getInstance().addNewRoom(roomName, doesUserExist);

      leaveAndJoin(PlanningRooms.getInstance().roomsArr, room, socket);
      io.emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
    } else {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
    }
  });

  socket.on(EVENTS.JOIN_ROOM, ({ roomId, user }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(user.id);
    const room = PlanningRooms.getInstance().getRoom(roomId);

    if (!doesUserExist) {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
      return;
    }

    if (!room) {
      socket.emit(EVENTS.ERROR, 'No room found with this ID');
      return;
    }

    PlanningRooms.getInstance().joinNewRoom(room, doesUserExist);

    leaveAndJoin(PlanningRooms.getInstance().roomsArr, room, socket);
    io.emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.START_VOTE, ({ room, user }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(user.id);
    const doesRoomExist = PlanningRooms.getInstance().getRoom(room.id);

    if (!doesUserExist) {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
      return;
    }

    if (!doesRoomExist) {
      socket.emit(EVENTS.ERROR, 'No room found with this ID');
      return;
    }

    const isUserInRoom = PlanningRooms.getInstance().isUserInRoom(doesUserExist, doesRoomExist);

    if (!isUserInRoom) {
      socket.emit(EVENTS.ERROR, 'This user is not in this room');
      return;
    }

    PlanningRooms.getInstance().startVote(doesRoomExist);
    io.to(doesRoomExist.id).emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.END_VOTE, ({ room, user }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(user.id);
    const doesRoomExist = PlanningRooms.getInstance().getRoom(room.id);

    if (!doesUserExist) {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
      return;
    }

    if (!doesRoomExist) {
      socket.emit(EVENTS.ERROR, 'No room found with this ID');
      return;
    }

    const isUserInRoom = PlanningRooms.getInstance().isUserInRoom(doesUserExist, doesRoomExist);

    if (!isUserInRoom) {
      socket.emit(EVENTS.ERROR, 'This user is not in this room');
      return;
    }

    PlanningRooms.getInstance().endVote(doesRoomExist);
    io.to(doesRoomExist.id).emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.VOTE, ({ room, vote }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(vote.userId);
    const doesRoomExist = PlanningRooms.getInstance().getRoom(room.id);

    if (!doesUserExist) {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
      return;
    }

    if (!doesRoomExist) {
      socket.emit(EVENTS.ERROR, 'No room found with this ID');
      return;
    }

    const isUserInRoom = PlanningRooms.getInstance().isUserInRoom(doesUserExist, doesRoomExist);

    if (!isUserInRoom) {
      socket.emit(EVENTS.ERROR, 'This user is not in this room');
      return;
    }

    if (!VoteValues.includes(vote.value)) {
      socket.emit(EVENTS.ERROR, 'Invalid vote value');
      return;
    }

    PlanningRooms.getInstance().vote(vote, doesRoomExist);
    io.to(doesRoomExist.id).emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.SET_QUESTION, ({ room, user, question }) => {
    const doesUserExist = PlanningRooms.getInstance().getUser(user.id);
    const doesRoomExist = PlanningRooms.getInstance().getRoom(room.id);

    if (!doesUserExist) {
      socket.emit(EVENTS.ERROR, 'No user found with this ID');
      return;
    }

    if (!doesRoomExist) {
      socket.emit(EVENTS.ERROR, 'No room found with this ID');
      return;
    }

    const isUserInRoom = PlanningRooms.getInstance().isUserInRoom(doesUserExist, doesRoomExist);

    if (!isUserInRoom) {
      socket.emit(EVENTS.ERROR, 'This user is not in this room');
      return;
    }

    PlanningRooms.getInstance().setQuestion(doesRoomExist, question);
    io.to(doesRoomExist.id).emit(EVENTS.GET_ROOMS, PlanningRooms.getInstance().roomsArr);
  });

  socket.on(EVENTS.POKE, ({ thisUser, otherUser }) => {
    const message = {
      to: otherUser,
      from: thisUser,
    };

    io.emit(EVENTS.POKE, message);
  });
});

const PORT = process.env.PORT || 3001;
const interval = 60 * 60 * 1000;

httpServer.listen(PORT, () => {
  PlanningRooms.getInstance();

  setInterval(() => {
    PlanningRooms.getInstance().checkDataSize();

    for (const room of PlanningRooms.getInstance().roomsArr) {
      if (room.lastActive < Date.now() - interval) {
        console.debug(`Deleting room ${room.id}`);
        PlanningRooms.getInstance().deleteRoom(room);
      }
    }
  }, interval);

  console.debug(`Server started at http://localhost:${PORT}`);
});
