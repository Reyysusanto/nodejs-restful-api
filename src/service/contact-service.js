import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  contactRegister,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const createContact = async (user, req) => {
  const contact = validate(contactRegister, req);
  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const getContact = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  return contact;
};

const updateContact = async (user, req) => {
  const contact = validate(updateContactValidation, req);

  const totalContact = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact.id,
    },
  });

  if (totalContact !== 1) {
    throw new ResponseError(404, "Contact not found");
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const removeContact = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const totalContact = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (totalContact !== 1) {
    throw new ResponseError(404, "Contact not found");
  }

  return prismaClient.contact.delete({
    where: {
      id: contactId,
    },
  });
};

const searchContact = async (user, req) => {
  req = validate(searchContactValidation, req);

  const skip = (req.page - 1) * req.size;

  const filters = [];

  filters.push({
    username: user.username,
  });

  if (req.name) {
    filters.push({
      OR: [
        {
          first_name: {
            contains: req.name,
          },
        },
        {
          last_name: {
            contains: req.name,
          },
        },
      ],
    });
  }

  if (req.email) {
    filters.push({
      email: {
        contains: req.email,
      },
    });
  }

  if (req.phone) {
    filters.push({
      phone: {
        contains: req.phone,
      },
    });
  }

  const contact = await prismaClient.contact.findMany({
    where: {
      AND: filters,
    },
    take: req.size,
    skip: skip,
  });

  const totalFilter = await prismaClient.contact.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: contact,
    paging: {
      page: req.page,
      total_item: totalFilter,
      total_page: Math.ceil(totalFilter / req.size),
    },
  };
};

export default {
  createContact,
  getContact,
  updateContact,
  removeContact,
  searchContact,
};
