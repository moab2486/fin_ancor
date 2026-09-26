function createAuthMiddleware(authService) {
  function authenticate(request, response, next) {
    const authorization = request.get("Authorization") || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return response.status(401).json({ error: "Bearer token required" });
    }

    try {
      request.auth = authService.verifyToken(token);
      return next();
    } catch (_error) {
      return response.status(401).json({ error: "Invalid or expired token" });
    }
  }

  function requireRole(...roles) {
    return (request, response, next) => {
      if (!request.auth || !roles.includes(request.auth.role)) {
        return response.status(403).json({ error: "Insufficient permissions" });
      }
      return next();
    };
  }

  return { authenticate, requireRole };
}

module.exports = { createAuthMiddleware };