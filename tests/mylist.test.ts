import request from 'supertest';
import express from 'express';
import myListRoutes from '../src/routes/mylist.routes';
import mongoose from 'mongoose';
import { UserModel } from '../src/models/user.model';
import { MovieModel } from '../src/models/movie.model';
import { TVShowModel } from '../src/models/tvshow.model';
import { FavoriteModel } from '../src/models/favorite.model';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', myListRoutes);

let userId: string;
let movieId: string;
let tvshowId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  userId = uuidv4();
  movieId = uuidv4();
  tvshowId = uuidv4();

  await UserModel.create({ _id: userId, username: 'test', preferences: { favoriteGenres: [], dislikedGenres: [] }, watchHistory: [] });
  await MovieModel.create({ _id: movieId, title: 'Test Movie', description: '', genres: [], releaseDate: new Date(), director: '', actors: [] });
  await TVShowModel.create({ _id: tvshowId, title: 'Test TV', description: '', genres: [], episodes: [] });
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await FavoriteModel.deleteMany({});
});

describe('My List APIs', () => {
  test('Add to list - success', async () => {
    const res = await request(app)
      .post('/api/mylist/add')
      .set('x-user-id', userId)
      .send({ contentId: movieId, contentType: 'movie' });
    expect(res.status).toBe(201);
  });

  test('Add to list - duplicate', async () => {
    await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: movieId, contentType: 'movie' });
    const res = await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: movieId, contentType: 'movie' });
    expect(res.status).toBe(409);
  });

  test('Add to list - content not found', async () => {
    const res = await request(app)
      .post('/api/mylist/add')
      .set('x-user-id', userId)
      .send({ contentId: uuidv4(), contentType: 'movie' });
    expect(res.status).toBe(404);
  });

  test('Remove from list - success', async () => {
    await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: movieId, contentType: 'movie' });
    const res = await request(app).delete(`/api/mylist/${movieId}`).set('x-user-id', userId);
    expect(res.status).toBe(200);
  });

  test('Remove from list - not found', async () => {
    const res = await request(app).delete(`/api/mylist/${uuidv4()}`).set('x-user-id', userId);
    expect(res.status).toBe(404);
  });

  test('List my items - success', async () => {
    await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: movieId, contentType: 'movie' });
    await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: tvshowId, contentType: 'tvshow' });
    const res = await request(app).get('/api/mylist').set('x-user-id', userId);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.items.length).toBe(2);
  });

  test('List my items - pagination', async () => {
    await request(app).post('/api/mylist/add').set('x-user-id', userId).send({ contentId: movieId, contentType: 'movie' });
    const res = await request(app).get('/api/mylist?limit=1&page=1').set('x-user-id', userId);
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
  });

  test('List my items - empty', async () => {
    const res = await request(app).get('/api/mylist').set('x-user-id', userId);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
  });
});