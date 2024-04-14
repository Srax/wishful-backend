import "dotenv/config";
import { GetVerificationKey, expressjwt as jwt } from "express-jwt";
import j from "jwks-rsa";
import config from "../config/config";
import jwksRsa from "jwks-rsa";

const issuerBaseUrl = config.AUTH0.ISSUER_BASE_URL;
const audience = config.AUTH0.AUDIENCE;

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuerBaseUrl}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `${issuerBaseUrl}/`,
  algorithms: ["RS256"],
});
