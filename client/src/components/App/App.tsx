import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { Backdrop, CircularProgress, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import JoinRoomDialog from 'components/JoinRoomDialog';
import CreateRoomDialog from 'components/CreateRoomDialog';
import Sidebar from 'components/Sidebar';
import MainVew from 'components/MainView';
import NameDialog from 'components/NameDialog';
import Notification from 'components/Notification';
import './App.css';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  });
});

function App() {
  const classes = useStyles();

  const loaded = useSelector((state: ReduxState) => {
    return state.userReducer.initialized;
  });

  return (
    <main>
      <Backdrop open={!loaded} className={classes.backdrop}>
        <CircularProgress color="secondary" />
      </Backdrop>
      <Notification />
      <NameDialog />
      <JoinRoomDialog />
      <CreateRoomDialog />
      <div className="left">
        <Sidebar />
      </div>
      <div className="right">
        <MainVew />
      </div>
    </main>
  );
}

export default App;
