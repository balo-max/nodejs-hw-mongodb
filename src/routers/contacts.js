import { Router } from "express";
import express from 'express';
import { createContactController, deleteContactController, getContactByIdController, getContactsController, updateContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkContactAccess } from "../middlewares/checkContactAccess.js";

const router = Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, checkContactAccess, ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', isValidId, checkContactAccess, jsonParser, validateBody(updateContactSchema), ctrlWrapper(updateContactController));

router.delete('/:contactId', isValidId, checkContactAccess, ctrlWrapper(deleteContactController));

export default router;