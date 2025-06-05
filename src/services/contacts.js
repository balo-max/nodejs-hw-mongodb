import { SORT_ORDER } from "../constants/index.js";
import { Contact } from "../models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
    filter = {},
    userId
}) => {
    
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = Contact.find({userId: userId});

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

export const getContactById = async (contactId, userId) => {
    return await Contact.findOne({_id:contactId, userId});
};

export const createContact = async (payload, photoUrl, userId) => {
    return await Contact.create({...payload, photo: photoUrl, userId});
};

export const updateContact = async(contactId, userId, payload, photoUrl) => {
    return await Contact.findOneAndUpdate({ _id: contactId, userId }, {...payload, photo: photoUrl}, { new: true });
};

export const deleteContact = async (contactId, userId) => {
    return await Contact.findOneAndDelete({_id: contactId, userId});
};