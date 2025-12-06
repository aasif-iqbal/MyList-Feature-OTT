import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genres: Genre[];
  releaseDate: Date;
  director: string;
  actors: string[];
}

const genreEnum: Genre[] = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

const movieSchema = new Schema<Movie>({
  _id: { type: String, default: () => uuidv4() },
  title: { type: String, required: true },
  description: { type: String },
  genres: [{ type: String, enum: genreEnum }],
  releaseDate: { type: Date },
  director: { type: String },
  actors: [{ type: String }],
}, { _id: false });

export const MovieModel = model<Movie>('Movie', movieSchema);