import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { BadRequestError, InternalServerError } from '../utils/errors';
import logger from '../utils/logger';

const service = new UserService(new UserRepository());

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use validatedQuery if available, otherwise fall back to req.query
    const queryParams = (req as any).validatedQuery || req.query;
    const result = await service.getAllUsers(queryParams);
    res.json(result);
  } catch (err) {
    logger.error('Error fetching users', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      query: (req as any).validatedQuery || req.query,
    });
    next(err instanceof Error ? err : new InternalServerError('Failed to fetch users'));
  }
};

export const bulkAddUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { users, manufacturerId } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      throw new BadRequestError('Users array is required and must not be empty');
    }

    if (!manufacturerId) {
      throw new BadRequestError('Manufacturer ID is required');
    }

    const result = await service.addUsersToManufacturer(users, manufacturerId);
    logger.info('Users added to manufacturer', {
      manufacturerId,
      userCount: users.length,
      modifiedCount: result.modifiedCount,
    });
    res.json({ modifiedCount: result.modifiedCount });
  } catch (err) {
    logger.error('Error adding users to manufacturer', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      manufacturerId: req.body.manufacturerId,
      userCount: Array.isArray(req.body.users) ? req.body.users.length : 0,
    });
    next(err);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await service.getUserStats();
    logger.info('User statistics fetched successfully');
    res.json(stats);
  } catch (err) {
    logger.error('Error fetching user statistics', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
    next(err instanceof Error ? err : new InternalServerError('Failed to fetch user statistics'));
  }
};
