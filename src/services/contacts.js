import { SORT_ORDER } from "../constants/index.js";
import { Contact } from "../models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
}) => {
    
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find();

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }

    if (typeof filter.isFavourite === 'boolean') {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contactsCount, contacts] = await Promise.all([

    Contact.find().merge(contactsQuery).countDocuments(),

    contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec()
]);

    const paginationData = calculatePaginationData(contactsCount, page, perPage);
    
    return {
        data: contacts,
        ...paginationData
    };
};

export const getContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
    return await Contact.create(payload);
};

export const updateContact = async(contactId, payload) => {
    return await Contact.findByIdAndUpdate(contactId, payload, { new: true });
};

export const deleteContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};