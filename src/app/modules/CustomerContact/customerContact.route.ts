import { Router } from "express";
import { CustomerContactController } from "./customerContact.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CustomerContactValidation } from "./customerContact.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// create customer contact (public)
router.post(
  "/",
  validateRequest(CustomerContactValidation.createCustomerContactValidation),
  CustomerContactController.createCustomerContact,
);

// get all customer contacts (admin only)
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CustomerContactController.getAllCustomerContacts,
);

// get single customer contact (admin only)
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CustomerContactController.getSingleCustomerContact,
);

// update customer contact (admin only)
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CustomerContactValidation.updateCustomerContactValidation),
  CustomerContactController.updateCustomerContact,
);

// delete customer contact (admin only)
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  CustomerContactController.deleteCustomerContact,
);

export const customerContactRoutes = router;
