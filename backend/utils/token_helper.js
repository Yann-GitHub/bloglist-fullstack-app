// Helper function to extract the token from the request header

/**
 * Extracts the JWT from the authorization header of a request.
 * @param {Object} request - The request object containing the headers.
 * @returns {string | null} - The extracted JWT or null if not found.
 */

const getTokenFromRequest = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

module.exports = { getTokenFromRequest };
