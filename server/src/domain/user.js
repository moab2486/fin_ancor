// RFC-5322-inspired email pattern: requires local@domain.tld structure
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function validateCredentials({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const errors = {};

  if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail)) {
    errors.email = "A valid email is required";
  }

  if (typeof password !== "string" || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    const error = new Error("Invalid credentials");
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }

  return { email: normalizedEmail, password };
}

function normalizePhone(phone) {
  return typeof phone === "string" ? phone.replace(/[^0-9]/g, "") : "";
}

function validatePhone(phone) {
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 8 || normalizedPhone.length > 15) {
    const error = new Error("A valid phone number is required");
    error.code = "VALIDATION_ERROR";
    error.details = { phone: error.message };
    throw error;
  }
  return normalizedPhone;
}

module.exports = { normalizeEmail, validateCredentials, validatePhone };
