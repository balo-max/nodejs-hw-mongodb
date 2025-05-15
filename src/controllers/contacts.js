import createHttpError from 'http-errors';
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from '../services/contacts.js';
import { validateObjectId } from '../utils/validateObjectId.js';

export const getContactsController = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;

    validateObjectId(contactId, 'Contact');

    const contact = await getContactById(contactId);

    if (!contact) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact
    });
};

export const createContactController = async (req, res) => {
    const newContact = await createContact(req.body);

    res.status(201).json({
        staus: 201,
        message: `Successfully created a contact ${req.body.name}!`,
        data: newContact,
    });
};

export const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;

    validateObjectId(contactId, 'Contact');

    const result = await updateContact(contactId, req.body);

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;

    validateObjectId(contactId, 'Contact');

    const result = await deleteContact(contactId);
    console.log(result);

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.sendStatus(204);
};  