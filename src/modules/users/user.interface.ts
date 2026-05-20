export enum Role{
    User = "user",
    PREMIUM_USer="premiumUser",
    ADMIN="admin",
}

export interface IUser{
  id: string;

  name: string;
  username: string;

  email: string;
  password: string;

  avatar?: string;

  role: Role

  favorite?: string[];

  watchlist?: string[];
  recentlyWatched?: string[];

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
};

