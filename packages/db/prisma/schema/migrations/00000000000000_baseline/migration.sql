--
-- PostgreSQL database dump
--



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'PROCESSING',
    'PAID',
    'FAILED',
    'CANCELLED',
    'OVERDUE'
);


--
-- Name: LeadSourceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadSourceType" AS ENUM (
    'FORM',
    'PHONE_CLICK',
    'WHATSAPP_CLICK',
    'EMAIL_CLICK',
    'DEMO_REQUEST',
    'REFERRAL',
    'MANUAL'
);


--
-- Name: LeadStage; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LeadStage" AS ENUM (
    'NEW',
    'QUALIFIED',
    'OPPORTUNITY',
    'CUSTOMER',
    'LOST'
);


--
-- Name: Origin; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Origin" AS ENUM (
    'BUILT_BY_APEX',
    'OPERATED_BY_APEX',
    'THIRD_PARTY_OSS'
);


--
-- Name: PortalAccountStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PortalAccountStatus" AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'CLOSED'
);


--
-- Name: PortalRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PortalRole" AS ENUM (
    'OWNER',
    'ADMIN',
    'MEMBER'
);


--
-- Name: ProjectStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProjectStatus" AS ENUM (
    'PLANNED',
    'ACTIVE',
    'WAITING',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: PublishStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PublishStatus" AS ENUM (
    'DRAFT',
    'LIVE',
    'INTERNAL',
    'ARCHIVED'
);


--
-- Name: QuoteStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."QuoteStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'ACCEPTED',
    'REJECTED',
    'EXPIRED'
);


--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'BLOCKED',
    'REVIEW',
    'DONE'
);


--
-- Name: TicketPriority; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


--
-- Name: TicketStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TicketStatus" AS ENUM (
    'OPEN',
    'WAITING',
    'RESOLVED',
    'CLOSED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _CaseStudySolutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_CaseStudySolutions" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _IndustrySolutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_IndustrySolutions" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _LeadProjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."_LeadProjects" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: attribution_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribution_reports (
    id text NOT NULL,
    "campaignSlug" text NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    leads integer NOT NULL,
    qualified integer NOT NULL,
    opportunities integer NOT NULL,
    customers integer NOT NULL,
    "revenueAmount" integer NOT NULL,
    "revenueCurrency" text DEFAULT 'USD'::text NOT NULL,
    "spendAmount" integer NOT NULL,
    "spendCurrency" text DEFAULT 'USD'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: attributions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attributions (
    id text NOT NULL,
    "leadId" text NOT NULL,
    "utmSource" text,
    "utmMedium" text,
    "utmCampaign" text,
    "utmTerm" text,
    "utmContent" text,
    gclid text,
    fbclid text,
    msclkid text,
    referrer text,
    "landingPath" text,
    "currentPath" text,
    "userAgent" text,
    "ipHash" text,
    country text,
    "consentAnalytics" boolean DEFAULT false NOT NULL,
    "consentMarketing" boolean DEFAULT false NOT NULL,
    "metaCapiSentAt" timestamp(3) without time zone,
    "googleAdsSentAt" timestamp(3) without time zone,
    "conversionErrors" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id text NOT NULL,
    "actorId" text,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    summary text NOT NULL,
    changes jsonb,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: campaign_spend; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaign_spend (
    id text NOT NULL,
    platform text NOT NULL,
    campaign text NOT NULL,
    "periodStart" timestamp(3) without time zone NOT NULL,
    "periodEnd" timestamp(3) without time zone NOT NULL,
    amount integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    impressions integer,
    clicks integer,
    source text DEFAULT 'manual'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    id text NOT NULL,
    slug text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    name text NOT NULL,
    channel text NOT NULL,
    objective text,
    "landingPath" text,
    "budgetAmount" integer,
    "budgetCurrency" text DEFAULT 'USD'::text NOT NULL,
    "interestSlug" text,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: case_studies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_studies (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    challenge text NOT NULL,
    strategy text NOT NULL,
    technology text NOT NULL,
    implementation text NOT NULL,
    result text NOT NULL,
    lessons text,
    "clientName" text,
    "clientConsent" boolean DEFAULT false NOT NULL,
    "consentRecordedAt" timestamp(3) without time zone,
    "consentReference" text,
    "anonymousLabel" text NOT NULL,
    technologies text[],
    "industryId" text,
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: case_study_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.case_study_metrics (
    id text NOT NULL,
    "caseStudyId" text NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    source text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: client_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_approvals (
    id text NOT NULL,
    "projectId" text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "requestedById" text,
    "respondedById" text,
    "respondedAt" timestamp(3) without time zone,
    "responseNote" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: client_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_documents (
    id text NOT NULL,
    "portalAccountId" text NOT NULL,
    filename text NOT NULL,
    key text NOT NULL,
    "mimeType" text NOT NULL,
    bytes integer NOT NULL,
    title text,
    description text,
    "uploadedByKind" text DEFAULT 'team'::text NOT NULL,
    "uploadedById" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: demo_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.demo_requests (
    id text NOT NULL,
    "productId" text NOT NULL,
    "leadId" text NOT NULL,
    "preferredTime" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: doc_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doc_pages (
    id text NOT NULL,
    "productId" text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    section text DEFAULT 'getting-started'::text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    scope text DEFAULT 'general'::text NOT NULL,
    "solutionId" text,
    "productId" text,
    status public."PublishStatus" DEFAULT 'LIVE'::public."PublishStatus" NOT NULL,
    "serviceId" text
);


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_flags (
    id text NOT NULL,
    key text NOT NULL,
    description text NOT NULL,
    "isEnabled" boolean DEFAULT false NOT NULL,
    rollout integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: industries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.industries (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    challenge text NOT NULL,
    approach text NOT NULL,
    outcome text NOT NULL,
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: insights; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insights (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    body text NOT NULL,
    category text NOT NULL,
    "readingMinutes" integer DEFAULT 5 NOT NULL,
    "authorName" text NOT NULL,
    "authorRole" text,
    "coverImageUrl" text,
    "coverImageAlt" text,
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.integrations (
    id text NOT NULL,
    provider text NOT NULL,
    label text NOT NULL,
    "isEnabled" boolean DEFAULT false NOT NULL,
    "secretCiphertext" text,
    "secretIv" text,
    "secretTag" text,
    "lastFour" text,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    "lastTestedAt" timestamp(3) without time zone,
    "lastTestOk" boolean,
    "lastTestNote" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id text NOT NULL,
    number text NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    "customerName" text NOT NULL,
    "customerEmail" text NOT NULL,
    "companyName" text,
    "subtotalAmount" integer NOT NULL,
    "taxAmount" integer DEFAULT 0 NOT NULL,
    "totalAmount" integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    notes text,
    "quoteId" text,
    "leadId" text,
    "serviceSlug" text,
    "productSlug" text,
    "paymentProvider" text,
    "paymentRef" text,
    "paidAt" timestamp(3) without time zone,
    "dueDate" timestamp(3) without time zone,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_postings (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    title text NOT NULL,
    team text NOT NULL,
    location text NOT NULL,
    "workMode" text NOT NULL,
    employment text NOT NULL,
    summary text NOT NULL,
    description text NOT NULL,
    responsibilities text[],
    requirements text[],
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "closesAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: kb_articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kb_articles (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    body text NOT NULL,
    category text NOT NULL,
    tags text[],
    "portalAccountId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: landing_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.landing_pages (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    headline text NOT NULL,
    subheadline text NOT NULL,
    body text,
    "ctaLabel" text DEFAULT 'Talk to our technology team'::text NOT NULL,
    bullets text[],
    "campaignName" text,
    "solutionSlug" text,
    "productSlug" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: lead_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_activities (
    id text NOT NULL,
    "leadId" text NOT NULL,
    "actorId" text,
    type text NOT NULL,
    summary text NOT NULL,
    detail text,
    meta jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id text NOT NULL,
    stage public."LeadStage" DEFAULT 'NEW'::public."LeadStage" NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    whatsapp text,
    "companyName" text,
    "jobTitle" text,
    country text,
    "countryCode" text,
    "companySize" text,
    "interestType" text,
    "interestSlug" text,
    requirements text,
    "budgetBand" text,
    timeline text,
    message text,
    "sourceType" public."LeadSourceType" DEFAULT 'FORM'::public."LeadSourceType" NOT NULL,
    "ownerId" text,
    "qualifiedAt" timestamp(3) without time zone,
    "convertedAt" timestamp(3) without time zone,
    "lostAt" timestamp(3) without time zone,
    "lostReason" text,
    "valueAmount" integer,
    "valueCurrency" text DEFAULT 'USD'::text NOT NULL,
    "nextFollowUpAt" timestamp(3) without time zone,
    "aiSummary" text,
    "aiScore" integer,
    "aiScoredAt" timestamp(3) without time zone,
    "aiModel" text,
    "dedupeKey" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: live_endpoints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_endpoints (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    kind text NOT NULL,
    "publicUrl" text,
    "originLoopback" text,
    summary text NOT NULL,
    role text NOT NULL,
    origin public."Origin" NOT NULL,
    "upstreamName" text,
    "upstreamUrl" text,
    "upstreamLicense" text,
    "isPubliclyLinkable" boolean DEFAULT true NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_assets (
    id text NOT NULL,
    key text NOT NULL,
    url text NOT NULL,
    filename text NOT NULL,
    "mimeType" text NOT NULL,
    bytes integer NOT NULL,
    width integer,
    height integer,
    alt text NOT NULL,
    "isDecorative" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: partner_integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.partner_integrations (
    id text NOT NULL,
    provider text NOT NULL,
    label text NOT NULL,
    "isEnabled" boolean DEFAULT false NOT NULL,
    "secretCiphertext" text,
    "secretIv" text,
    "secretTag" text,
    "lastFour" text,
    config jsonb DEFAULT '{}'::jsonb NOT NULL,
    "lastTestedAt" timestamp(3) without time zone,
    "lastTestOk" boolean,
    "lastTestNote" text,
    "lastEventAt" timestamp(3) without time zone,
    "lastEventKind" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    key text NOT NULL,
    "moduleId" text NOT NULL,
    label text NOT NULL
);


--
-- Name: plan_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.plan_features (
    id text NOT NULL,
    "planId" text NOT NULL,
    label text NOT NULL,
    included boolean DEFAULT true NOT NULL,
    "limitNote" text,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: portal_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_accounts (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    status public."PortalAccountStatus" DEFAULT 'ACTIVE'::public."PortalAccountStatus" NOT NULL,
    "defaultTimezone" text,
    "defaultCurrency" text DEFAULT 'USD'::text NOT NULL,
    "leadId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: portal_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_audit_log (
    id text NOT NULL,
    "portalAccountId" text,
    "portalUserId" text,
    action text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text,
    summary text NOT NULL,
    changes jsonb,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portal_invitations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_invitations (
    id text NOT NULL,
    "portalAccountId" text NOT NULL,
    email text NOT NULL,
    role public."PortalRole" DEFAULT 'MEMBER'::public."PortalRole" NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "acceptedAt" timestamp(3) without time zone,
    "invitedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portal_magic_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_magic_links (
    id text NOT NULL,
    email text NOT NULL,
    "userId" text,
    "tokenHash" text NOT NULL,
    purpose text DEFAULT 'sign-in'::text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portal_oauth_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_oauth_accounts (
    id text NOT NULL,
    "userId" text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    "accessTokenCiphertext" text,
    "accessTokenIv" text,
    "accessTokenTag" text,
    "refreshTokenCiphertext" text,
    "refreshTokenIv" text,
    "refreshTokenTag" text,
    "expiresAt" timestamp(3) without time zone,
    scopes text,
    "lastUsedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: portal_password_resets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_password_resets (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "usedAt" timestamp(3) without time zone,
    "ipAddress" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portal_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_sessions (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "lastSeenAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portal_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portal_users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "passwordHash" text,
    "emailVerifiedAt" timestamp(3) without time zone,
    "totpSecretCiphertext" text,
    "totpSecretIv" text,
    "totpSecretTag" text,
    "totpEnabledAt" timestamp(3) without time zone,
    "failedLogins" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "portalAccountId" text NOT NULL,
    role public."PortalRole" DEFAULT 'MEMBER'::public."PortalRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: pricing_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_plans (
    id text NOT NULL,
    "productId" text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "priceAmount" integer,
    "priceCurrency" text DEFAULT 'USD'::text NOT NULL,
    "pricePeriod" text,
    "isCustom" boolean DEFAULT false NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "ctaLabel" text DEFAULT 'Request a demo'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: product_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_features (
    id text NOT NULL,
    "productId" text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    icon text,
    benefit text,
    "isShipped" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: product_integrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_integrations (
    id text NOT NULL,
    "productId" text NOT NULL,
    name text NOT NULL,
    description text,
    "logoUrl" text,
    "docsUrl" text,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: product_screenshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_screenshots (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text NOT NULL,
    caption text,
    "isRealCapture" boolean DEFAULT true NOT NULL,
    "capturedAt" timestamp(3) without time zone,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id text NOT NULL,
    slug text NOT NULL,
    status public."ProjectStatus" DEFAULT 'PLANNED'::public."ProjectStatus" NOT NULL,
    name text NOT NULL,
    summary text,
    body text,
    "portalAccountId" text,
    "leadId" text,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "budgetAmount" integer,
    "budgetCurrency" text DEFAULT 'USD'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quotes (
    id text NOT NULL,
    number text NOT NULL,
    status public."QuoteStatus" DEFAULT 'DRAFT'::public."QuoteStatus" NOT NULL,
    "customerName" text NOT NULL,
    "customerEmail" text NOT NULL,
    "companyName" text,
    "lineItems" jsonb NOT NULL,
    "subtotalAmount" integer NOT NULL,
    "taxAmount" integer DEFAULT 0 NOT NULL,
    "totalAmount" integer NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    notes text,
    "validUntil" timestamp(3) without time zone,
    "leadId" text,
    "serviceSlug" text,
    "productSlug" text,
    "acceptedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id text NOT NULL,
    key text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: saas_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saas_products (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    category text NOT NULL,
    problem text NOT NULL,
    solution text NOT NULL,
    summary text NOT NULL,
    origin public."Origin" NOT NULL,
    "upstreamName" text,
    "upstreamUrl" text,
    "upstreamLicense" text,
    "isPubliclyReachable" boolean DEFAULT false NOT NULL,
    "publicUrl" text,
    "docsUrl" text,
    "loginUrl" text,
    "demoAvailable" boolean DEFAULT false NOT NULL,
    "trialAvailable" boolean DEFAULT false NOT NULL,
    "trialDays" integer,
    "securityNotes" text,
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: seo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seo (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "ogImageUrl" text,
    noindex boolean DEFAULT false NOT NULL,
    canonical text
);


--
-- Name: service_bundles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_bundles (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    summary text NOT NULL,
    body text,
    "serviceSlugs" text[],
    "bundlePriceAmount" integer NOT NULL,
    "sumPriceAmount" integer NOT NULL,
    "feeCurrency" text DEFAULT 'USD'::text NOT NULL,
    "bestFor" text NOT NULL,
    outcomes text[],
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    summary text NOT NULL,
    body text,
    icon text,
    "flatFeeAmount" integer NOT NULL,
    "feeCurrency" text DEFAULT 'USD'::text NOT NULL,
    "timelineDays" integer NOT NULL,
    "timelineLabel" text NOT NULL,
    category text NOT NULL,
    origin public."Origin" NOT NULL,
    "upstreamName" text,
    "upstreamUrl" text,
    "upstreamLicense" text,
    deliverables text[],
    outcomes text[],
    technologies text[],
    "isBundleOnly" boolean DEFAULT false NOT NULL,
    "bundleSlugs" text[] DEFAULT ARRAY[]::text[],
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    "group" text DEFAULT 'general'::text NOT NULL,
    label text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: solutions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solutions (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    name text NOT NULL,
    tagline text NOT NULL,
    summary text NOT NULL,
    body text,
    icon text,
    capabilities text[],
    outcomes text[],
    "seoId" text,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id text NOT NULL,
    "projectId" text NOT NULL,
    title text NOT NULL,
    description text,
    status public."TaskStatus" DEFAULT 'TODO'::public."TaskStatus" NOT NULL,
    "estimatedHours" double precision,
    "actualHours" double precision,
    "assigneeId" text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tech_proof_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tech_proof_entries (
    id text NOT NULL,
    slug text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    summary text NOT NULL,
    detail text NOT NULL,
    origin public."Origin" NOT NULL,
    "upstreamName" text,
    "upstreamUrl" text,
    "upstreamLicense" text,
    "publicUrl" text,
    "isPubliclyReachable" boolean DEFAULT false NOT NULL,
    technologies text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: tech_proof_evidence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tech_proof_evidence (
    id text NOT NULL,
    "entryId" text NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    source text NOT NULL,
    "measuredAt" timestamp(3) without time zone,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id text NOT NULL,
    status public."PublishStatus" DEFAULT 'DRAFT'::public."PublishStatus" NOT NULL,
    quote text NOT NULL,
    "authorName" text NOT NULL,
    "authorRole" text NOT NULL,
    company text NOT NULL,
    consent boolean DEFAULT false NOT NULL,
    "consentRecordedAt" timestamp(3) without time zone,
    "consentReference" text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ticket_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_comments (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "authorKind" text NOT NULL,
    "authorId" text NOT NULL,
    body text NOT NULL,
    "isInternal" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id text NOT NULL,
    number text NOT NULL,
    status public."TicketStatus" DEFAULT 'OPEN'::public."TicketStatus" NOT NULL,
    priority public."TicketPriority" DEFAULT 'NORMAL'::public."TicketPriority" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "portalAccountId" text,
    "leadId" text,
    "openedById" text,
    "assigneeId" text,
    tags text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resolvedAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone
);


--
-- Name: timesheets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timesheets (
    id text NOT NULL,
    "userId" text NOT NULL,
    "projectId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    hours double precision NOT NULL,
    note text,
    "invoiceLineId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    "userId" text NOT NULL,
    "roleId" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    "passwordHash" text,
    image text,
    "emailVerified" timestamp(3) without time zone,
    "totpSecret" text,
    "totpEnabledAt" timestamp(3) without time zone,
    "lastLoginAt" timestamp(3) without time zone,
    "failedLogins" integer DEFAULT 0 NOT NULL,
    "lockedUntil" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerifiedAt" timestamp(3) without time zone
);


--
-- Name: webhook_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_events (
    id text NOT NULL,
    provider text NOT NULL,
    "eventType" text NOT NULL,
    "providerEventId" text,
    "responseStatus" integer NOT NULL,
    "signatureOk" boolean DEFAULT false NOT NULL,
    "payloadSummary" text NOT NULL,
    "payloadBytes" bytea,
    "sourceIp" text,
    "userAgent" text,
    "handledAs" text,
    error text,
    "receivedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _CaseStudySolutions _CaseStudySolutions_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_CaseStudySolutions"
    ADD CONSTRAINT "_CaseStudySolutions_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _IndustrySolutions _IndustrySolutions_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_IndustrySolutions"
    ADD CONSTRAINT "_IndustrySolutions_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _LeadProjects _LeadProjects_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_LeadProjects"
    ADD CONSTRAINT "_LeadProjects_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: attribution_reports attribution_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribution_reports
    ADD CONSTRAINT attribution_reports_pkey PRIMARY KEY (id);


--
-- Name: attributions attributions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT attributions_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: campaign_spend campaign_spend_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaign_spend
    ADD CONSTRAINT campaign_spend_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: case_studies case_studies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT case_studies_pkey PRIMARY KEY (id);


--
-- Name: case_study_metrics case_study_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_study_metrics
    ADD CONSTRAINT case_study_metrics_pkey PRIMARY KEY (id);


--
-- Name: client_approvals client_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_approvals
    ADD CONSTRAINT client_approvals_pkey PRIMARY KEY (id);


--
-- Name: client_documents client_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_documents
    ADD CONSTRAINT client_documents_pkey PRIMARY KEY (id);


--
-- Name: demo_requests demo_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);


--
-- Name: doc_pages doc_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doc_pages
    ADD CONSTRAINT doc_pages_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: industries industries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: insights insights_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT insights_pkey PRIMARY KEY (id);


--
-- Name: integrations integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.integrations
    ADD CONSTRAINT integrations_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: kb_articles kb_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kb_articles
    ADD CONSTRAINT kb_articles_pkey PRIMARY KEY (id);


--
-- Name: landing_pages landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.landing_pages
    ADD CONSTRAINT landing_pages_pkey PRIMARY KEY (id);


--
-- Name: lead_activities lead_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT lead_activities_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: live_endpoints live_endpoints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_endpoints
    ADD CONSTRAINT live_endpoints_pkey PRIMARY KEY (id);


--
-- Name: media_assets media_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: partner_integrations partner_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.partner_integrations
    ADD CONSTRAINT partner_integrations_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: plan_features plan_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT plan_features_pkey PRIMARY KEY (id);


--
-- Name: portal_accounts portal_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_accounts
    ADD CONSTRAINT portal_accounts_pkey PRIMARY KEY (id);


--
-- Name: portal_audit_log portal_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_audit_log
    ADD CONSTRAINT portal_audit_log_pkey PRIMARY KEY (id);


--
-- Name: portal_invitations portal_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_invitations
    ADD CONSTRAINT portal_invitations_pkey PRIMARY KEY (id);


--
-- Name: portal_magic_links portal_magic_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_magic_links
    ADD CONSTRAINT portal_magic_links_pkey PRIMARY KEY (id);


--
-- Name: portal_oauth_accounts portal_oauth_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_oauth_accounts
    ADD CONSTRAINT portal_oauth_accounts_pkey PRIMARY KEY (id);


--
-- Name: portal_password_resets portal_password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_password_resets
    ADD CONSTRAINT portal_password_resets_pkey PRIMARY KEY (id);


--
-- Name: portal_sessions portal_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_sessions
    ADD CONSTRAINT portal_sessions_pkey PRIMARY KEY (id);


--
-- Name: portal_users portal_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_users
    ADD CONSTRAINT portal_users_pkey PRIMARY KEY (id);


--
-- Name: pricing_plans pricing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_plans
    ADD CONSTRAINT pricing_plans_pkey PRIMARY KEY (id);


--
-- Name: product_features product_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_features
    ADD CONSTRAINT product_features_pkey PRIMARY KEY (id);


--
-- Name: product_integrations product_integrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_integrations
    ADD CONSTRAINT product_integrations_pkey PRIMARY KEY (id);


--
-- Name: product_screenshots product_screenshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_screenshots
    ADD CONSTRAINT product_screenshots_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY ("roleId", "permissionId");


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: saas_products saas_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saas_products
    ADD CONSTRAINT saas_products_pkey PRIMARY KEY (id);


--
-- Name: seo seo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seo
    ADD CONSTRAINT seo_pkey PRIMARY KEY (id);


--
-- Name: service_bundles service_bundles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_bundles
    ADD CONSTRAINT service_bundles_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: solutions solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: tech_proof_entries tech_proof_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tech_proof_entries
    ADD CONSTRAINT tech_proof_entries_pkey PRIMARY KEY (id);


--
-- Name: tech_proof_evidence tech_proof_evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tech_proof_evidence
    ADD CONSTRAINT tech_proof_evidence_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: ticket_comments ticket_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT ticket_comments_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: timesheets timesheets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timesheets
    ADD CONSTRAINT timesheets_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY ("userId", "roleId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webhook_events webhook_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_events
    ADD CONSTRAINT webhook_events_pkey PRIMARY KEY (id);


--
-- Name: _CaseStudySolutions_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_CaseStudySolutions_B_index" ON public."_CaseStudySolutions" USING btree ("B");


--
-- Name: _IndustrySolutions_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_IndustrySolutions_B_index" ON public."_IndustrySolutions" USING btree ("B");


--
-- Name: _LeadProjects_B_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "_LeadProjects_B_index" ON public."_LeadProjects" USING btree ("B");


--
-- Name: attribution_reports_campaignSlug_periodEnd_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attribution_reports_campaignSlug_periodEnd_idx" ON public.attribution_reports USING btree ("campaignSlug", "periodEnd");


--
-- Name: attribution_reports_campaignSlug_periodStart_periodEnd_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attribution_reports_campaignSlug_periodStart_periodEnd_key" ON public.attribution_reports USING btree ("campaignSlug", "periodStart", "periodEnd");


--
-- Name: attributions_leadId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "attributions_leadId_key" ON public.attributions USING btree ("leadId");


--
-- Name: attributions_utmCampaign_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attributions_utmCampaign_idx" ON public.attributions USING btree ("utmCampaign");


--
-- Name: attributions_utmSource_utmMedium_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "attributions_utmSource_utmMedium_idx" ON public.attributions USING btree ("utmSource", "utmMedium");


--
-- Name: audit_log_actorId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_log_actorId_createdAt_idx" ON public.audit_log USING btree ("actorId", "createdAt");


--
-- Name: audit_log_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_log_createdAt_idx" ON public.audit_log USING btree ("createdAt");


--
-- Name: audit_log_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "audit_log_entityType_entityId_idx" ON public.audit_log USING btree ("entityType", "entityId");


--
-- Name: campaign_spend_platform_campaign_periodStart_periodEnd_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "campaign_spend_platform_campaign_periodStart_periodEnd_key" ON public.campaign_spend USING btree (platform, campaign, "periodStart", "periodEnd");


--
-- Name: campaign_spend_platform_periodStart_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "campaign_spend_platform_periodStart_idx" ON public.campaign_spend USING btree (platform, "periodStart");


--
-- Name: campaigns_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX campaigns_slug_key ON public.campaigns USING btree (slug);


--
-- Name: campaigns_status_channel_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX campaigns_status_channel_idx ON public.campaigns USING btree (status, channel);


--
-- Name: case_studies_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "case_studies_seoId_key" ON public.case_studies USING btree ("seoId");


--
-- Name: case_studies_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX case_studies_slug_key ON public.case_studies USING btree (slug);


--
-- Name: case_studies_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "case_studies_status_publishedAt_idx" ON public.case_studies USING btree (status, "publishedAt");


--
-- Name: case_study_metrics_caseStudyId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "case_study_metrics_caseStudyId_idx" ON public.case_study_metrics USING btree ("caseStudyId");


--
-- Name: client_approvals_projectId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "client_approvals_projectId_status_idx" ON public.client_approvals USING btree ("projectId", status);


--
-- Name: client_documents_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX client_documents_key_key ON public.client_documents USING btree (key);


--
-- Name: client_documents_portalAccountId_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "client_documents_portalAccountId_publishedAt_idx" ON public.client_documents USING btree ("portalAccountId", "publishedAt");


--
-- Name: demo_requests_leadId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "demo_requests_leadId_key" ON public.demo_requests USING btree ("leadId");


--
-- Name: demo_requests_productId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "demo_requests_productId_idx" ON public.demo_requests USING btree ("productId");


--
-- Name: doc_pages_productId_section_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "doc_pages_productId_section_order_idx" ON public.doc_pages USING btree ("productId", section, "order");


--
-- Name: doc_pages_productId_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "doc_pages_productId_slug_key" ON public.doc_pages USING btree ("productId", slug);


--
-- Name: faqs_scope_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faqs_scope_order_idx ON public.faqs USING btree (scope, "order");


--
-- Name: feature_flags_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX feature_flags_key_key ON public.feature_flags USING btree (key);


--
-- Name: industries_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "industries_seoId_key" ON public.industries USING btree ("seoId");


--
-- Name: industries_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX industries_slug_key ON public.industries USING btree (slug);


--
-- Name: industries_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX industries_status_order_idx ON public.industries USING btree (status, "order");


--
-- Name: insights_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "insights_seoId_key" ON public.insights USING btree ("seoId");


--
-- Name: insights_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX insights_slug_key ON public.insights USING btree (slug);


--
-- Name: insights_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "insights_status_publishedAt_idx" ON public.insights USING btree (status, "publishedAt");


--
-- Name: integrations_provider_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX integrations_provider_key ON public.integrations USING btree (provider);


--
-- Name: invoices_dueDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "invoices_dueDate_idx" ON public.invoices USING btree ("dueDate");


--
-- Name: invoices_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX invoices_number_key ON public.invoices USING btree (number);


--
-- Name: invoices_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "invoices_status_createdAt_idx" ON public.invoices USING btree (status, "createdAt");


--
-- Name: job_postings_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "job_postings_seoId_key" ON public.job_postings USING btree ("seoId");


--
-- Name: job_postings_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX job_postings_slug_key ON public.job_postings USING btree (slug);


--
-- Name: job_postings_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX job_postings_status_idx ON public.job_postings USING btree (status);


--
-- Name: kb_articles_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX kb_articles_slug_key ON public.kb_articles USING btree (slug);


--
-- Name: kb_articles_status_publishedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "kb_articles_status_publishedAt_idx" ON public.kb_articles USING btree (status, "publishedAt");


--
-- Name: landing_pages_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX landing_pages_slug_key ON public.landing_pages USING btree (slug);


--
-- Name: landing_pages_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX landing_pages_status_idx ON public.landing_pages USING btree (status);


--
-- Name: lead_activities_leadId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "lead_activities_leadId_createdAt_idx" ON public.lead_activities USING btree ("leadId", "createdAt");


--
-- Name: leads_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_createdAt_idx" ON public.leads USING btree ("createdAt");


--
-- Name: leads_dedupeKey_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "leads_dedupeKey_key" ON public.leads USING btree ("dedupeKey");


--
-- Name: leads_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX leads_email_idx ON public.leads USING btree (email);


--
-- Name: leads_ownerId_stage_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_ownerId_stage_idx" ON public.leads USING btree ("ownerId", stage);


--
-- Name: leads_stage_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_stage_createdAt_idx" ON public.leads USING btree (stage, "createdAt");


--
-- Name: live_endpoints_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX live_endpoints_slug_key ON public.live_endpoints USING btree (slug);


--
-- Name: live_endpoints_status_kind_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX live_endpoints_status_kind_order_idx ON public.live_endpoints USING btree (status, kind, "order");


--
-- Name: media_assets_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX media_assets_key_key ON public.media_assets USING btree (key);


--
-- Name: pages_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "pages_seoId_key" ON public.pages USING btree ("seoId");


--
-- Name: pages_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pages_slug_key ON public.pages USING btree (slug);


--
-- Name: partner_integrations_provider_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX partner_integrations_provider_key ON public.partner_integrations USING btree (provider);


--
-- Name: permissions_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX permissions_key_key ON public.permissions USING btree (key);


--
-- Name: permissions_moduleId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "permissions_moduleId_idx" ON public.permissions USING btree ("moduleId");


--
-- Name: plan_features_planId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "plan_features_planId_order_idx" ON public.plan_features USING btree ("planId", "order");


--
-- Name: portal_accounts_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX portal_accounts_slug_key ON public.portal_accounts USING btree (slug);


--
-- Name: portal_accounts_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_accounts_status_createdAt_idx" ON public.portal_accounts USING btree (status, "createdAt");


--
-- Name: portal_audit_log_portalAccountId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_audit_log_portalAccountId_createdAt_idx" ON public.portal_audit_log USING btree ("portalAccountId", "createdAt");


--
-- Name: portal_audit_log_portalUserId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_audit_log_portalUserId_createdAt_idx" ON public.portal_audit_log USING btree ("portalUserId", "createdAt");


--
-- Name: portal_invitations_portalAccountId_acceptedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_invitations_portalAccountId_acceptedAt_idx" ON public.portal_invitations USING btree ("portalAccountId", "acceptedAt");


--
-- Name: portal_invitations_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "portal_invitations_tokenHash_key" ON public.portal_invitations USING btree ("tokenHash");


--
-- Name: portal_magic_links_email_purpose_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_magic_links_email_purpose_expiresAt_idx" ON public.portal_magic_links USING btree (email, purpose, "expiresAt");


--
-- Name: portal_magic_links_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "portal_magic_links_tokenHash_key" ON public.portal_magic_links USING btree ("tokenHash");


--
-- Name: portal_oauth_accounts_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "portal_oauth_accounts_provider_providerAccountId_key" ON public.portal_oauth_accounts USING btree (provider, "providerAccountId");


--
-- Name: portal_oauth_accounts_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_oauth_accounts_userId_idx" ON public.portal_oauth_accounts USING btree ("userId");


--
-- Name: portal_password_resets_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "portal_password_resets_tokenHash_key" ON public.portal_password_resets USING btree ("tokenHash");


--
-- Name: portal_password_resets_userId_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_password_resets_userId_expiresAt_idx" ON public.portal_password_resets USING btree ("userId", "expiresAt");


--
-- Name: portal_sessions_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "portal_sessions_tokenHash_key" ON public.portal_sessions USING btree ("tokenHash");


--
-- Name: portal_sessions_userId_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_sessions_userId_expiresAt_idx" ON public.portal_sessions USING btree ("userId", "expiresAt");


--
-- Name: portal_users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX portal_users_email_key ON public.portal_users USING btree (email);


--
-- Name: portal_users_portalAccountId_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "portal_users_portalAccountId_role_idx" ON public.portal_users USING btree ("portalAccountId", role);


--
-- Name: pricing_plans_productId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "pricing_plans_productId_order_idx" ON public.pricing_plans USING btree ("productId", "order");


--
-- Name: product_features_productId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "product_features_productId_order_idx" ON public.product_features USING btree ("productId", "order");


--
-- Name: product_integrations_productId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "product_integrations_productId_order_idx" ON public.product_integrations USING btree ("productId", "order");


--
-- Name: product_screenshots_productId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "product_screenshots_productId_order_idx" ON public.product_screenshots USING btree ("productId", "order");


--
-- Name: projects_portalAccountId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "projects_portalAccountId_status_idx" ON public.projects USING btree ("portalAccountId", status);


--
-- Name: projects_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX projects_slug_key ON public.projects USING btree (slug);


--
-- Name: projects_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "projects_status_createdAt_idx" ON public.projects USING btree (status, "createdAt");


--
-- Name: quotes_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quotes_number_key ON public.quotes USING btree (number);


--
-- Name: quotes_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "quotes_status_createdAt_idx" ON public.quotes USING btree (status, "createdAt");


--
-- Name: roles_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX roles_key_key ON public.roles USING btree (key);


--
-- Name: saas_products_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "saas_products_seoId_key" ON public.saas_products USING btree ("seoId");


--
-- Name: saas_products_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX saas_products_slug_key ON public.saas_products USING btree (slug);


--
-- Name: saas_products_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX saas_products_status_order_idx ON public.saas_products USING btree (status, "order");


--
-- Name: service_bundles_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "service_bundles_seoId_key" ON public.service_bundles USING btree ("seoId");


--
-- Name: service_bundles_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX service_bundles_slug_key ON public.service_bundles USING btree (slug);


--
-- Name: service_bundles_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_bundles_status_order_idx ON public.service_bundles USING btree (status, "order");


--
-- Name: services_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "services_seoId_key" ON public.services USING btree ("seoId");


--
-- Name: services_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX services_slug_key ON public.services USING btree (slug);


--
-- Name: services_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX services_status_order_idx ON public.services USING btree (status, "order");


--
-- Name: sessions_sessionToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "sessions_sessionToken_key" ON public.sessions USING btree ("sessionToken");


--
-- Name: sessions_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sessions_userId_idx" ON public.sessions USING btree ("userId");


--
-- Name: settings_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_group_idx ON public.settings USING btree ("group");


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: solutions_seoId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "solutions_seoId_key" ON public.solutions USING btree ("seoId");


--
-- Name: solutions_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX solutions_slug_key ON public.solutions USING btree (slug);


--
-- Name: solutions_status_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX solutions_status_order_idx ON public.solutions USING btree (status, "order");


--
-- Name: tasks_projectId_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tasks_projectId_order_idx" ON public.tasks USING btree ("projectId", "order");


--
-- Name: tech_proof_entries_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tech_proof_entries_slug_key ON public.tech_proof_entries USING btree (slug);


--
-- Name: tech_proof_entries_status_category_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tech_proof_entries_status_category_order_idx ON public.tech_proof_entries USING btree (status, category, "order");


--
-- Name: tech_proof_evidence_entryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tech_proof_evidence_entryId_idx" ON public.tech_proof_evidence USING btree ("entryId");


--
-- Name: ticket_comments_ticketId_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ticket_comments_ticketId_createdAt_idx" ON public.ticket_comments USING btree ("ticketId", "createdAt");


--
-- Name: tickets_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tickets_number_key ON public.tickets USING btree (number);


--
-- Name: tickets_portalAccountId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tickets_portalAccountId_status_idx" ON public.tickets USING btree ("portalAccountId", status);


--
-- Name: tickets_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "tickets_status_createdAt_idx" ON public.tickets USING btree (status, "createdAt");


--
-- Name: timesheets_projectId_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "timesheets_projectId_date_idx" ON public.timesheets USING btree ("projectId", date);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: webhook_events_providerEventId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "webhook_events_providerEventId_idx" ON public.webhook_events USING btree ("providerEventId");


--
-- Name: webhook_events_provider_eventType_receivedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "webhook_events_provider_eventType_receivedAt_idx" ON public.webhook_events USING btree (provider, "eventType", "receivedAt");


--
-- Name: webhook_events_receivedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "webhook_events_receivedAt_idx" ON public.webhook_events USING btree ("receivedAt");


--
-- Name: _CaseStudySolutions _CaseStudySolutions_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_CaseStudySolutions"
    ADD CONSTRAINT "_CaseStudySolutions_A_fkey" FOREIGN KEY ("A") REFERENCES public.case_studies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _CaseStudySolutions _CaseStudySolutions_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_CaseStudySolutions"
    ADD CONSTRAINT "_CaseStudySolutions_B_fkey" FOREIGN KEY ("B") REFERENCES public.solutions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _IndustrySolutions _IndustrySolutions_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_IndustrySolutions"
    ADD CONSTRAINT "_IndustrySolutions_A_fkey" FOREIGN KEY ("A") REFERENCES public.industries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _IndustrySolutions _IndustrySolutions_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_IndustrySolutions"
    ADD CONSTRAINT "_IndustrySolutions_B_fkey" FOREIGN KEY ("B") REFERENCES public.solutions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _LeadProjects _LeadProjects_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_LeadProjects"
    ADD CONSTRAINT "_LeadProjects_A_fkey" FOREIGN KEY ("A") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _LeadProjects _LeadProjects_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."_LeadProjects"
    ADD CONSTRAINT "_LeadProjects_B_fkey" FOREIGN KEY ("B") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: attributions attributions_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attributions
    ADD CONSTRAINT "attributions_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_log audit_log_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT "audit_log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: case_studies case_studies_industryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT "case_studies_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES public.industries(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: case_studies case_studies_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_studies
    ADD CONSTRAINT "case_studies_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: case_study_metrics case_study_metrics_caseStudyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.case_study_metrics
    ADD CONSTRAINT "case_study_metrics_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES public.case_studies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: client_documents client_documents_portalAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_documents
    ADD CONSTRAINT "client_documents_portalAccountId_fkey" FOREIGN KEY ("portalAccountId") REFERENCES public.portal_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: demo_requests demo_requests_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT "demo_requests_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: demo_requests demo_requests_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT "demo_requests_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: doc_pages doc_pages_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doc_pages
    ADD CONSTRAINT "doc_pages_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: faqs faqs_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT "faqs_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: faqs faqs_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT "faqs_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.services(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: faqs faqs_solutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT "faqs_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES public.solutions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: industries industries_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.industries
    ADD CONSTRAINT "industries_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: insights insights_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights
    ADD CONSTRAINT "insights_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: invoices invoices_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT "invoices_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public.quotes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: job_postings job_postings_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT "job_postings_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: lead_activities lead_activities_actorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT "lead_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: lead_activities lead_activities_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_activities
    ADD CONSTRAINT "lead_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leads leads_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT "leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pages pages_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT "pages_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: plan_features plan_features_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.plan_features
    ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.pricing_plans(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_accounts portal_accounts_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_accounts
    ADD CONSTRAINT "portal_accounts_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: portal_audit_log portal_audit_log_portalAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_audit_log
    ADD CONSTRAINT "portal_audit_log_portalAccountId_fkey" FOREIGN KEY ("portalAccountId") REFERENCES public.portal_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_audit_log portal_audit_log_portalUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_audit_log
    ADD CONSTRAINT "portal_audit_log_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES public.portal_users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: portal_invitations portal_invitations_portalAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_invitations
    ADD CONSTRAINT "portal_invitations_portalAccountId_fkey" FOREIGN KEY ("portalAccountId") REFERENCES public.portal_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_magic_links portal_magic_links_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_magic_links
    ADD CONSTRAINT "portal_magic_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.portal_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_oauth_accounts portal_oauth_accounts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_oauth_accounts
    ADD CONSTRAINT "portal_oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.portal_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_password_resets portal_password_resets_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_password_resets
    ADD CONSTRAINT "portal_password_resets_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.portal_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_sessions portal_sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_sessions
    ADD CONSTRAINT "portal_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.portal_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: portal_users portal_users_portalAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portal_users
    ADD CONSTRAINT "portal_users_portalAccountId_fkey" FOREIGN KEY ("portalAccountId") REFERENCES public.portal_accounts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pricing_plans pricing_plans_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_plans
    ADD CONSTRAINT "pricing_plans_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_features product_features_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_features
    ADD CONSTRAINT "product_features_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_integrations product_integrations_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_integrations
    ADD CONSTRAINT "product_integrations_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_screenshots product_screenshots_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_screenshots
    ADD CONSTRAINT "product_screenshots_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.saas_products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: quotes quotes_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT "quotes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: saas_products saas_products_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saas_products
    ADD CONSTRAINT "saas_products_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: service_bundles service_bundles_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_bundles
    ADD CONSTRAINT "service_bundles_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: services services_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT "services_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: sessions sessions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solutions solutions_seoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT "solutions_seoId_fkey" FOREIGN KEY ("seoId") REFERENCES public.seo(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tasks tasks_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tech_proof_evidence tech_proof_evidence_entryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tech_proof_evidence
    ADD CONSTRAINT "tech_proof_evidence_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES public.tech_proof_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ticket_comments ticket_comments_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_comments
    ADD CONSTRAINT "ticket_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tickets tickets_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public.leads(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_roles user_roles_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


