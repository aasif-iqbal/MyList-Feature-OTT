import express from 'express';
import * as myListService from '../services/mylist.service';

const router = express.Router();

router.post('/mylist/add', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { contentId, contentType } = req.body;

  if (!userId || !contentId || !contentType || !['movie', 'tvshow'].includes(contentType)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    await myListService.addToList(userId, contentId, contentType);
    res.status(201).json({ message: 'Added to list' });
  } catch (err: any) {
    if (err.message === 'Content not found') {
      return res.status(404).json({ error: err.message });
    }
    if (err.message === 'Item already in list') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/mylist/:contentId', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const { contentId } = req.params;

  if (!userId || !contentId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    await myListService.removeFromList(userId, contentId);
    res.status(200).json({ message: 'Removed from list' });
  } catch (err: any) {
    if (err.message === 'Item not found in list') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/mylist', async (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  if (!userId) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const result = await myListService.getMyList(userId, page, limit);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;