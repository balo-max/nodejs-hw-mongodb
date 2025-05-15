import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const validateObjectId = (id, resourceName = 'Resource') => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(404, `${resourceName} not found`);
    }
};