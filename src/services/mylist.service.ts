import { MovieModel } from '../models/movie.model';
import { TVShowModel } from '../models/tvshow.model';
import { FavoriteModel } from '../models/favorite.model';
import { Movie } from '../models/movie.model'; // For type
import { TVShow } from '../models/tvshow.model'; // For type

export async function addToList(userId: string, contentId: string, contentType: 'movie' | 'tvshow') {
  let content;
  if (contentType === 'movie') {
    content = await MovieModel.findById(contentId);
  } else {
    content = await TVShowModel.findById(contentId);
  }
  if (!content) {
    throw new Error('Content not found');
  }

  try {
    await new FavoriteModel({ userId, contentId, contentType }).save();
  } catch (err: any) {
    if (err.code === 11000) {
      throw new Error('Item already in list');
    }
    throw err;
  }
}

export async function removeFromList(userId: string, contentId: string) {
  const result = await FavoriteModel.deleteOne({ userId, contentId });
  if (result.deletedCount === 0) {
    throw new Error('Item not found in list');
  }
}

export async function getMyList(userId: string, page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  const [favorites, total] = await Promise.all([
    FavoriteModel.find({ userId }).sort({ addedAt: -1 }).skip(skip).limit(limit).lean(),
    FavoriteModel.countDocuments({ userId }),
  ]);

  const items: (Movie | TVShow)[] = await Promise.all(
    favorites.map(async (fav) => {
      if (fav.contentType === 'movie') {
        return (await MovieModel.findById(fav.contentId).lean()) as Movie;
      } else {
        return (await TVShowModel.findById(fav.contentId).lean()) as TVShow;
      }
    })
  );

  return { items, total, page, limit };
}