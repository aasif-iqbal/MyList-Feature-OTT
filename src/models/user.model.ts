import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

export interface User {
  _id: string;
  username: string;
  preferences: {
    favoriteGenres: Genre[];
    dislikedGenres: Genre[];
  };
  watchHistory: Array<{
    contentId: string;
    watchedOn: Date;
    rating?: number;
  }>;
}

const genreEnum: Genre[] = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

const userSchema = new Schema<User>({
  _id: { type: String, default: () => uuidv4() },
  username: { type: String, required: true, unique: true },
  preferences: {
    favoriteGenres: [{ type: String, enum: genreEnum }],
    dislikedGenres: [{ type: String, enum: genreEnum }],
  },
  watchHistory: [{
    contentId: { type: String },
    watchedOn: { type: Date },
    rating: { type: Number },
  }],
}, { _id: false });

export const UserModel = model<User>('User', userSchema);