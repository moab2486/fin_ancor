const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async listUsers({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
    const size = Math.min(Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    const skip = (Math.max(1, Number(page) || 1) - 1) * size;

    const users = await this.userRepository.list({ skip, take: size });
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}

module.exports = { UserService };
