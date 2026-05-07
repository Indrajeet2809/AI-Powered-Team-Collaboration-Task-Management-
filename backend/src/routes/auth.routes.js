const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

//use for validation
const validate = require("../middlewares/validate.middleware");

// Use for validation
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const {
  isAuthenticated,
} = require("../middlewares/auth.middleware");

router.post("/register", validate(registerSchema),  authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.get("/me",isAuthenticated,authController.getMe);

module.exports = router;