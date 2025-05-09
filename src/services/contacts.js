import { Contact } from "../models/contact.js";

export const getAllContacts = async () => {
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (err) {
        console.log(err);
    }
};

export const getContactById = async (contactId) => {
    try {
        const contactById = await Contact.findById(contactId);
        return contactById;
    } catch (err) {
        console.log(err);
    }
};