/**
 * Forward lead enquiry to the Apex CRM.
 *
 * Implementation moved to `@apex/site-kit/forward-lead`. This shim keeps the
 * sibling's import path stable and re-exports the symbols the contact API
 * route consumes.
 */
export {
  type ApexLeadInput,
  type Attribution as ApexLeadAttribution,
  type ForwardOptions,
  type ForwardResult,
  type LeadInput,
  type Visitor as ApexVisitor,
  forwardLeadToApex,
  spool as spoolLeadPayload,
  visitorFrom,
} from "@apex/site-kit/forward-lead";
