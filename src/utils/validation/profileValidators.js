import validator from "validator";
const validateUpdateUser = (req, res, next) => {
  const data = req.body;

  // Prototype pollution guard
  if ("__proto__" in data || "constructor" in data) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid payload",
    });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "No data provided for update",
    });
  }

  const notAllowedUpdates = [
    "_id",
    "fullName",
    "email",
    "password",
    "createdAt",
    "updatedAt",
  ];

  const invalidKeys = Object.keys(data).filter((key) =>
    notAllowedUpdates.includes(key)
  );

  if (invalidKeys.length > 0) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid update fields",
      invalidFields: invalidKeys,
    });
  }

  // photoUrl
  if (Object.hasOwn(data, "photoUrl")) {
    if (data.photoUrl === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "photoUrl cannot be null",
        field: "photoUrl",
      });
    }
    if (typeof data.photoUrl !== "string" || !validator.isURL(data.photoUrl)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid photoUrl",
        field: "photoUrl",
      });
    }
    data.photoUrl = data.photoUrl.trim();
    if (data.photoUrl.length === 0) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "photoUrl cannot be empty",
        field: "photoUrl",
      });
    }
  }

  // address
  if (Object.hasOwn(data, "address")) {
    if (data.address === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Address cannot be null",
        field: "address",
      });
    }
    if (typeof data.address !== "string") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Address must be a string",
        field: "address",
      });
    }
    data.address = data.address.trim();
    if (data.address.length === 0) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Address cannot be empty",
        field: "address",
      });
    }
    if (data.address.length > 200) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Address must be under 200 characters",
        field: "address",
      });
    }
  }

  // age
  if (Object.hasOwn(data, "age")) {
    if (!Number.isInteger(data.age)) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Age must be an integer",
        field: "age",
      });
    }
    if (data.age < 16 || data.age > 100) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Age must be between 16 and 100",
        field: "age",
      });
    }
  }

  // bio
  if (Object.hasOwn(data, "bio")) {
    if (data.bio === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Bio cannot be null",
        field: "bio",
      });
    }
    if (typeof data.bio !== "string") {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Bio must be a string",
        field: "bio",
      });
    }
    data.bio = data.bio.trim();
    if (data.bio.length === 0) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Bio cannot be empty",
        field: "bio",
      });
    }
    if (data.bio.length > 200) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Bio must be under 200 characters",
        field: "bio",
      });
    }
  }

  // skills
  if (Object.hasOwn(data, "skills")) {
    if (data.skills === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Skills cannot be null",
        field: "skills",
      });
    }
    if (
      !Array.isArray(data.skills) ||
      data.skills.length > 20 ||
      !data.skills.every(skill => typeof skill === "string")
    ) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Skills must be an array of strings with maximum 20 items",
        field: "skills",
      });
    }
    data.skills = [...new Set(
      data.skills.map(skill => skill.trim().toLowerCase()).filter(Boolean)
    )];
  }

  // linkedinUrl
  if (Object.hasOwn(data, "linkedinUrl")) {
    if (data.linkedinUrl === null) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "LinkedIn URL cannot be null",
        field: "linkedinUrl",
      });
    }
    if (
      typeof data.linkedinUrl !== "string" ||
      !validator.isURL(data.linkedinUrl) ||
      !data.linkedinUrl.includes("linkedin.com")
    ) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid LinkedIn URL",
        field: "linkedinUrl",
      });
    }
    data.linkedinUrl = data.linkedinUrl.trim();
    if (data.linkedinUrl.length === 0) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "LinkedIn URL cannot be empty",
        field: "linkedinUrl",
      });
    }
  }

  req.validatedData = data;
  next();
};
export {
    validateUpdateUser
}