const z = require("zod");

const userSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets and spaces"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid Email"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
});

const addressSchema = z.object({
  address1: z.string().min(1, "Address 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string()
    .min(1, "ZIP code is required")
    .regex(/^\d{6}$/, "ZIP code must be 6 digits"),
});

module.exports = { userSchema, addressSchema };
