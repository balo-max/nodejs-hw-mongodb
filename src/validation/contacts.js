import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        'string.base': 'Name must be a text string',
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must not exceed 30 characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required().messages({
      'string.base': 'Phone number must be a string',
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must contain only digits and may start with +',
      'any.required': 'Phone number is required',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).optional().messages({
      'string.email': 'Email must be a valid email address',
      'string.base': 'Email must be a string',
    }),
    isFavourite: Joi.boolean().default(false).messages({
      'boolean.base': 'isFavourite must be a boolean value',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type is required',
      'string.base': 'Contact type must be a string',
    }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).messages({
        'string.base': 'Name must be a text string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must not exceed 30 characters',
    }),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]{7,15}$/).messages({
      'string.base': 'Phone number must be a string',
      'string.pattern.base': 'Phone number must contain only digits and may start with +',
    }),
    email: Joi.string().email({ tlds: { allow: false } }).optional().messages({
      'string.email': 'Email must be a valid email address',
      'string.base': 'Email must be a string',
    }),
    isFavourite: Joi.boolean().default(false).messages({
      'boolean.base': 'isFavourite must be a boolean value',
    }),
    contactType: Joi.string().valid('work', 'home', 'personal').messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'string.base': 'Contact type must be a string',
    }),
});