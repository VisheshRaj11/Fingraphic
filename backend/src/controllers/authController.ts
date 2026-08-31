import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbUser, dbPortfolio } from '../config/storage';
import { ENV } from '../config/env';
import { AuthenticatedRequest } from '../types/index';

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, avatarUrl } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: 'Email, password, and name are required.' });
      return;
    }

    const existingUser = await dbUser.findOneByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await dbUser.create({
      email: email.toLowerCase(),
      passwordHash,
      name,
      avatarUrl: avatarUrl || '',
      emailDigestOptIn: true,
    });

    // Initialize default portfolio for user
    await dbPortfolio.create({
      userId: newUser._id.toString(),
      initialCapital: 100000,
      cashBalance: 100000,
      holdings: [],
    });

    const token = jwt.sign(
      { userId: newUser._id.toString(), email: newUser.email },
      ENV.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl,
        emailDigestOptIn: newUser.emailDigestOptIn,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Registration failed.' });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await dbUser.findOneByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      ENV.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        emailDigestOptIn: user.emailDigestOptIn,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Login failed.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await dbUser.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching user profile.' });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, avatarUrl, emailDigestOptIn } = req.body;

    const user = await dbUser.updateProfile(req.user.userId, { name, avatarUrl, emailDigestOptIn });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        emailDigestOptIn: user.emailDigestOptIn,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Profile update failed.' });
  }
};
