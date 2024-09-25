const z = require("zod");

// Validates when a new user creates an account
const newUserValidation = (data) => {
  const registerValidationSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Please input a valid email")
      .nonempty("Email is required"),
    password: z.string().min(8, "Password must be 8 or more characters").trim(),

    // Make username optional
    username: z
      .string()
      .min(6, "Username must be 6 characters or more")
      .optional()
      .or(z.literal("")), // Accepts an empty string as valid
  });

  return registerValidationSchema.safeParse(data); // Returns success or error
};
const userLoginValidation = (data) => {
  const loginValidationSchema = z.object({
    password: z.string().min(8, "Password must be 8 or more characters").trim(),
  });

  return loginValidationSchema.safeParse(data);
};
module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;
