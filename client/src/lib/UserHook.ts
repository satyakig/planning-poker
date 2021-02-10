import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/CombinedReducer';
import { useMemo } from 'react';

export function UserInfo() {
  const user = useSelector((state: ReduxState) => {
    return state.userReducer.user;
  });

  return useMemo(() => {
    return {
      user,
      validUser: user.id.length > 0,
    };
  }, [user]);
}
