import createHttpError from 'http-errors';
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
};

export const getContactByIdController = async (req, res) => {
    const contactId = req.contact._id;

    const contact = await getContactById(contactId);

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
};

export const createContactController = async (req, res) => {
    const newContact = await createContact(req.body, req.user._id);

    res.status(201).json({
        staus: 201,
        message: `Successfully created a contact ${req.body.name}!`,
        data: newContact,
    });
};

export const updateContactController = async (req, res, next) => {
    const contactId = req.contact._id;

    const result = await updateContact(contactId, req.body);

    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result,
    });
};

export const deleteContactController = async (req, res) => {
    const contactId = req.contact._id;

    const result = await deleteContact(contactId);

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.sendStatus(204);
};  