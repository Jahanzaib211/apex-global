/**
 * The Apex group of companies — re-exports the canonical list from
 * `@apex/site-kit/site` with `self: true` set on `apex-outsourcing`.
 */
import { withSelf } from "@apex/site-kit/site";

export const APEX_GROUP = withSelf("apex-outsourcing");
