import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createApiKey,
  getApiKeys,
  getApiKeyById,
  updateApiKey,
  deleteApiKey,
  validateApiKey
} from '../controllers/apiKeyController.js';

const router = express.Router();

// Public API key validation
router.post('/validate', validateApiKey);

// All other routes require authentication
router.use(authenticate);

// Create new API key
router.post('/:userId/create', createApiKey);

// Get all API keys for user
router.get('/:userId', getApiKeys);

// Get specific API key details
router.get('/key/:keyId', getApiKeyById);

// Update API key settings
router.put('/key/:keyId', updateApiKey);

// Delete API key
router.delete('/key/:keyId', deleteApiKey);

export default router;
