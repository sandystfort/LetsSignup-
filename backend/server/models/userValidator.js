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
    username: z.string().min(6, "Username must be 6 characters or more"), // Make username required
  });

  return registerValidationSchema.safeParse(data); // Returns success or error
};

// Validates when a user logs in
const userLoginValidation = (data) => {
  const loginValidationSchema = z.object({
    email: z
      .string()
      .email("Please input a valid email")
      .nonempty("Email is required"),
    password: z.string().min(8, "Password must be 8 or more characters").trim(),
  });

  return loginValidationSchema.safeParse(data);
};

module.exports.newUserValidation = newUserValidation;
module.exports.userLoginValidation = userLoginValidation;
