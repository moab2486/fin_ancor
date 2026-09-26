class PrismaUserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByPhone(phone) {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  create(data) {
    return this.prisma.user.create({ data });
  }

  deleteById(id) {
    return this.prisma.user.delete({ where: { id } });
  }

  list({ skip = 0, take = 50 } = {}) {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      skip,
      take,
    });
  }
}

module.exports = { PrismaUserRepository };
