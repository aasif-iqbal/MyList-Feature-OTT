import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../src/models/user.model';
import { MovieModel } from '../src/models/movie.model';
import { TVShowModel } from '../src/models/tvshow.model';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);

  // Clear existing data
  await UserModel.deleteMany({});
  await MovieModel.deleteMany({});
  await TVShowModel.deleteMany({});

  // Create user
  const userId = uuidv4();
  await UserModel.create({
    _id: userId,
    username: 'testuser',
    preferences: { favoriteGenres: ['Action'], dislikedGenres: ['Horror'] },
    watchHistory: [],
  });

  // Create movies
  const movie1Id = uuidv4();
  await MovieModel.create({
    _id: movie1Id,
    title: 'Inception',
    description: 'A mind-bending thriller',
    genres: ['SciFi', 'Action'],
    releaseDate: new Date('2010-07-16'),
    director: 'Christopher Nolan',
    actors: ['Leonardo DiCaprio'],
  });

  const movie2Id = uuidv4();
  await MovieModel.create({
    _id: movie2Id,
    title: 'The Matrix',
    description: 'Reality is a simulation',
    genres: ['SciFi', 'Action'],
    releaseDate: new Date('1999-03-31'),
    director: 'Wachowskis',
    actors: ['Keanu Reeves'],
  });

  // Create TV show
  const tvshowId = uuidv4();
  await TVShowModel.create({
    _id: tvshowId,
    title: 'Stranger Things',
    description: 'Supernatural adventures',
    genres: ['SciFi', 'Horror'],
    episodes: [
      {
        episodeNumber: 1,
        seasonNumber: 1,
        releaseDate: new Date('2016-07-15'),
        director: 'Duffer Brothers',
        actors: ['Millie Bobby Brown'],
      },
    ],
  });

  console.log('Data seeded. User ID:', userId, 'Movie1 ID:', movie1Id, 'Movie2 ID:', movie2Id, 'TVShow ID:', tvshowId);
  await mongoose.disconnect();
}

seed().catch(err => console.error(err));