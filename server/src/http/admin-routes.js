const express = require("express");

function createAdminRouter(userService, authenticate, requireRole) {
  const router = express.Router();

  router.get("/users", authenticate, requireRole("ADMIN"), async (request, response) => {
    try {
      const { page, pageSize } = request.query;
      const users = await userService.listUsers({ page, pageSize });
      response.json({ users });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = { createAdminRouter };