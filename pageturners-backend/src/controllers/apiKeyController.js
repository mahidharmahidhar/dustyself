import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const generateApiKey = () => {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
};

export const createApiKey = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, role = 'USER', rateLimit = 100, expiresAt } = req.body;

    const key = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: {
        key,
        name,
        userId,
        role,
        rateLimit,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.json({
      success: true,
      apiKey: {
        ...apiKey,
        key: apiKey.key // Only show once during creation
      },
      message: 'API key created. Save it securely - you won\'t see it again'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getApiKeys = async (req, res) => {
  try {
    const { userId } = req.params;

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        role: true,
        rateLimit: true,
        usedCount: true,
        isActive: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        key: false // Don't show full key
      }
    });

    res.json({ success: true, apiKeys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getApiKeyById = async (req, res) => {
  try {
    const { keyId } = req.params;

    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
      select: {
        id: true,
        name: true,
        role: true,
        rateLimit: true,
        usedCount: true,
        isActive: true,
        createdAt: true,
        lastUsedAt: true,
        key: false
      }
    });

    if (!apiKey) {
      return res.status(404).json({ success: false, error: 'API key not found' });
    }

    res.json({ success: true, apiKey });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const { name, rateLimit, isActive } = req.body;

    const apiKey = await prisma.apiKey.update({
      where: { id: keyId },
      data: {
        ...(name && { name }),
        ...(rateLimit && { rateLimit }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        name: true,
        role: true,
        rateLimit: true,
        isActive: true
      }
    });

    res.json({ success: true, apiKey });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;

    await prisma.apiKey.delete({ where: { id: keyId } });

    res.json({ success: true, message: 'API key deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const validateApiKey = async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) {
      return res.status(401).json({ success: false, error: 'API key required' });
    }

    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey }
    });

    if (!key || !key.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    }

    if (key.expiresAt && new Date() > key.expiresAt) {
      return res.status(401).json({ success: false, error: 'API key expired' });
    }

    if (key.usedCount >= key.rateLimit) {
      return res.status(429).json({ success: false, error: 'Rate limit exceeded' });
    }

    // Update usage
    await prisma.apiKey.update({
      where: { id: key.id },
      data: {
        usedCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    });

    res.json({
      success: true,
      apiKey: {
        id: key.id,
        role: key.role,
        userId: key.userId,
        usedCount: key.usedCount + 1,
        rateLimit: key.rateLimit
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
