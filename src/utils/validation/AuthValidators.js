import validator from "validator";
const validateRegisterUser = (req, res, next) => {
  const data = req.body;

  if ("__proto__" in data || "constructor" in data) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid payload",
    });
  }

  const requiredFields = ["fullName", "email", "password"];

  const missingFields = requiredFields.filter(
    field => !Object.hasOwn(data, field)
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Missing required fields",
      fields: missingFields,
    });
  }

  // fullName
  if (data.fullName === null || typeof data.fullName !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Full name must be a string",
      field: "fullName",
    });
  }

  data.fullName = data.fullName.trim();
  if (data.fullName.length < 2 || data.fullName.length > 20) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Full name must be between 2 and 20 characters",
      field: "fullName",
    });
  }

  data.fullName =
    data.fullName.charAt(0).toUpperCase() + data.fullName.slice(1);

  // email
  if (data.email === null || typeof data.email !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Email must be a string",
      field: "email",
    });
  }

  data.email = data.email.trim().toLowerCase();
  if (!validator.isEmail(data.email)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid email address",
      field: "email",
    });
  }

  // password
  if (data.password === null || typeof data.password !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Password must be a string",
      field: "password",
    });
  }

  data.password = data.password.trim();
  if (data.password.length < 8) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Password must be at least 8 characters long",
      field: "password",
    });
  }

  req.validatedData = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  };

  next();
};

const validateLoginUser = (req, res, next) => {
  const data = req.body;

  if ("__proto__" in data || "constructor" in data) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid payload",
    });
  }

  const requiredFields = ["email", "password"];

  const missingFields = requiredFields.filter(
    field => !Object.hasOwn(data, field)
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Missing required fields",
      fields: missingFields,
    });
  }

  // email
  if (data.email === null || typeof data.email !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Email must be a string",
      field: "email",
    });
  }

  data.email = data.email.trim().toLowerCase();
  if (!validator.isEmail(data.email)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid email address",
      field: "email",
    });
  }

  // password
  if (data.password === null || typeof data.password !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Password must be a string",
      field: "password",
    });
  }

  data.password = data.password.trim();
  if (data.password.length === 0) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Password cannot be empty",
      field: "password",
    });
  }

  req.validatedData = {
    email: data.email,
    password: data.password,
  };

  next();
};


export {
    validateRegisterUser,
    validateLoginUser,
    
}