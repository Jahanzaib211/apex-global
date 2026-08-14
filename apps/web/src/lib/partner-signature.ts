/**
 * Re-exported from `@apex/site-kit` so migrated siblings get the same HMAC
 * verifier for the partner endpoint without copying the code.
 */
export {
  SIGNATURE_TOLERANCE_SECONDS,
  type SignatureFailure,
  sign,
  signaturePayload,
  verifyPartnerSignature,
} from "@apex/site-kit/partner-signature";
