const { validateCredentials, validatePhone } = require("../domain/user");

class AuthService {
  constructor({ userRepository, passwordHasher, tokenService, otpService }) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
    this.otpService = otpService;
  }

  async register(input) {
    const credentials = validateCredentials(input);
    const phone = validatePhone(input.phone);
    const existingUser = await this.userRepository.findByEmail(credentials.email);

    if (existingUser) {
      throw createError("Email is already registered", "EMAIL_TAKEN");
    }

    if (await this.userRepository.findByPhone(phone)) {
      throw createError("Phone number is already registered", "PHONE_TAKEN");
    }

    let user;
    try {
      user = await this.userRepository.create({
        email: credentials.email,
        phone,
        name: typeof input.name === "string" ? input.name.trim() || null : null,
        passwordHash: await this.passwordHasher.hash(credentials.password),
      });
    } catch (error) {
      // Prisma unique constraint violation — another request raced us to the same email/phone
      if (error.code === "P2002") {
        const field = error.meta?.target?.includes("phone") ? "phone" : "email";
        throw createError(
          field === "phone" ? "Phone number is already registered" : "Email is already registered",
          field === "phone" ? "PHONE_TAKEN" : "EMAIL_TAKEN",
        );
      }
      throw error;
    }

    try {
      return await this.requestOtp(user);
    } catch (otpError) {
      // Best-effort rollback — if the delete itself fails, log it but re-throw the original error
      try {
        await this.userRepository.deleteById(user.id);
      } catch (deleteError) {
        console.error("Failed to roll back user after OTP delivery failure:", deleteError);
      }
      throw otpError;
    }
  }

  async login(input) {
    const credentials = validateCredentials(input);
    const user = await this.userRepository.findByEmail(credentials.email);
    const validPassword = user
      ? await this.passwordHasher.compare(credentials.password, user.passwordHash)
      : false;

    if (!user || !validPassword) {
      throw createError("Invalid email or password", "INVALID_LOGIN");
    }

    return this.requestOtp(user);
  }

  async verifyOtp(input) {
    const userId = await this.otpService.verify(input.challengeId, input.code);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw createError("OTP user no longer exists", "INVALID_OTP");
    }

    return this.toAuthResult(user);
  }

  verifyToken(token) {
    return this.tokenService.verify(token);
  }

  requestOtp(user) {
    if (!user.phone) {
      throw createError("A phone number is required for OTP authentication", "PHONE_REQUIRED");
    }
    return this.otpService.issue({ userId: user.id, phone: user.phone });
  }

  toAuthResult(user) {
    return {
      token: this.tokenService.sign({ sub: String(user.id), email: user.email, role: user.role }),
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
    };
  }
}

function createError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

module.exports = { AuthService };
