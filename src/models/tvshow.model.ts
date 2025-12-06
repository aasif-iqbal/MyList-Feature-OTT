import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

type Genre = 'Action' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Romance' | 'SciFi';

export interface TVShow {
  _id: string;
  title: string;
  description: string;
  genres: Genre[];
  episodes: Array<{
    episodeNumber: number;
    seasonNumber: number;
    releaseDate: Date;
    director: string;
    actors: string[];
  }>;
}

const genreEnum: Genre[] = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'SciFi'];

const tvShowSchema = new Schema<TVShow>({
  _id: { type: String, default: () => uuidv4() },
  title: { type: String, required: true },
  description: { type: String },
  genres: [{ type: String, enum: genreEnum }],
  episodes: [{
    episodeNumber: { type: Number },
    seasonNumber: { type: Number },
    releaseDate: { type: Date },
    director: { type: String },
    actors: [{ type: String }],
  }],
}, { _id: false });

export const TVShowModel = model<TVShow>('TVShow', tvShowSchema);