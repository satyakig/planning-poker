export const VoteValues = [1, 2, 3, 5, 8, '?'];

export type User = {
  id: string;
  name: string;
};

export type Vote = {
  value: string | number;
  userId: string;
};

export type Room = {
  id: string;
  name: string;
  users: User[];
  lastActive: number;
  currentQuestion: string;
  voteActive: boolean;
  voteTimeout: number;
  votes: Vote[];
};
