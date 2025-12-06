import { Schema, model } from 'mongoose';

export interface Favorite {
  userId: string;
  contentId: string;
  contentType: 'movie' | 'tvshow';
  addedAt: Date;
}

const favoriteSchema = new Schema<Favorite>({
  userId: { type: String, required: true },
  contentId: { type: String, required: true },
  contentType: { type: String, enum: ['movie', 'tvshow'], required: true },
  addedAt: { type: Date, default: Date.now },
});

favoriteSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export const FavoriteModel = model<Favorite>('Favorite', favoriteSchema);