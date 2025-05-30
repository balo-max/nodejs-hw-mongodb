import createHttpError from 'http-errors';
import { getContactById } from '../services/contacts.js';

export const checkContactAccess = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId);

    if (!contact) {
      throw new createHttpError(404, 'Contact not found');
    }

    if (contact.userId.toString() !== userId.toString()) {
      throw new createHttpError(403, 'No access to this contact');
    }

    req.contact = contact;
    next();
  } catch (error) {
    next(error);
  }
};
