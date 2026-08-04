/* eslint-disable no-console */
import { PrismaClient } from "../generated/client/index.js";
import { assertCredibility } from "./credibility.js";
import { industries } from "./content/industries.js";
import { products } from "./content/products.js";
import { caseStudies, faqs, insights, landingPages, roles, settings } from "./content/site.js";
import { solutions } from "./content/solutions.js";
import { techProof } from "./content/tech-proof.js";

const prisma = new PrismaClient();

/** Permission catalogue. Modules contribute these; the console reads them. */
const PERMISSIONS = [
  ["core", "core:read", "View console"],
  ["core", "core:admin", "Manage users, roles and integrations"],
  ["cms", "cms:read", "View content"],
  ["cms", "cms:write", "Create and edit content"],
  ["cms", "cms:publish", "Publish content to the live site"],
  ["crm", "crm:read", "View leads and pipeline"],
  ["crm", "crm:write", "Edit leads, change stage, add notes"],
  ["crm", "crm:admin", "Configure pipeline and assignment"],
  ["saas", "saas:read", "View products"],
  ["saas", "saas:write", "Edit products, pricing and docs"],
  ["ai-assist", "ai:read", "View AI configuration and output"],
  ["ai-assist", "ai:admin", "Configure providers and credentials"],
] as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: PERMISSIONS.map(([, key]) => key),
  editor: ["core:read", "cms:read", "cms:write", "cms:publish", "saas:read", "saas:write", "ai:read"],
  sales: ["core:read", "cms:read", "crm:read", "crm:write", "saas:read", "ai:read"],
  viewer: ["core:read", "cms:read", "crm:read", "saas:read", "ai:read"],
};

async function seedCore() {
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      create: { key: s.key, group: s.group, label: s.label, value: s.value },
      // Settings are edited in the console. Re-seeding must not overwrite what
      // an operator has changed — only the label and grouping are refreshed.
      update: { label: s.label, group: s.group },
    });
  }

  for (const [moduleId, key, label] of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      create: { key, moduleId, label },
      update: { moduleId, label },
    });
  }

  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { key: r.key },
      create: { key: r.key, name: r.name, description: r.description, isSystem: r.isSystem },
      update: { name: r.name, description: r.description },
    });

    const keys = ROLE_PERMISSIONS[r.key] ?? [];
    const perms = await prisma.permission.findMany({ where: { key: { in: keys } } });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: perms.map((p) => ({ roleId: role.id, permissionId: p.id })),
      skipDuplicates: true,
    });
  }

  console.log(`  core: ${settings.length} settings, ${roles.length} roles, ${PERMISSIONS.length} permissions`);
}

async function seedSolutions() {
  for (const s of solutions) {
    const seo = await prisma.seo.create({
      data: { title: s.seoTitle, description: s.seoDescription },
    });

    await prisma.solution.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        order: s.order,
        status: "LIVE",
        name: s.name,
        tagline: s.tagline,
        summary: s.summary,
        body: s.body,
        icon: s.icon,
        capabilities: [...s.capabilities],
        outcomes: [...s.outcomes],
        publishedAt: new Date(),
        seoId: seo.id,
      },
      update: {
        order: s.order,
        name: s.name,
        tagline: s.tagline,
        summary: s.summary,
        body: s.body,
        capabilities: [...s.capabilities],
        outcomes: [...s.outcomes],
      },
    });
  }
  console.log(`  cms: ${solutions.length} solutions`);
}

async function seedIndustries() {
  for (const i of industries) {
    const seo = await prisma.seo.create({
      data: { title: i.seoTitle, description: i.seoDescription },
    });

    const solutionRecords = await prisma.solution.findMany({
      where: { slug: { in: [...i.solutionSlugs] } },
      select: { id: true },
    });

    await prisma.industry.upsert({
      where: { slug: i.slug },
      create: {
        slug: i.slug,
        order: i.order,
        status: "LIVE",
        name: i.name,
        tagline: i.tagline,
        challenge: i.challenge,
        approach: i.approach,
        outcome: i.outcome,
        publishedAt: new Date(),
        seoId: seo.id,
        solutions: { connect: solutionRecords.map((s) => ({ id: s.id })) },
      },
      update: {
        name: i.name,
        tagline: i.tagline,
        challenge: i.challenge,
        approach: i.approach,
        outcome: i.outcome,
        solutions: { set: solutionRecords.map((s) => ({ id: s.id })) },
      },
    });
  }
  console.log(`  cms: ${industries.length} industries`);
}

async function seedTechProof() {
  for (const t of techProof) {
    const entry = await prisma.techProofEntry.upsert({
      where: { slug: t.slug },
      create: {
        slug: t.slug,
        order: t.order,
        status: t.status,
        title: t.title,
        category: t.category,
        summary: t.summary,
        detail: t.detail,
        origin: t.origin,
        upstreamName: t.upstreamName ?? null,
        upstreamUrl: t.upstreamUrl ?? null,
        upstreamLicense: t.upstreamLicense ?? null,
        isPubliclyReachable: t.isPubliclyReachable,
        publicUrl: t.publicUrl ?? null,
        technologies: [...t.technologies],
      },
      update: {
        order: t.order,
        status: t.status,
        title: t.title,
        summary: t.summary,
        detail: t.detail,
        origin: t.origin,
        upstreamName: t.upstreamName ?? null,
        upstreamUrl: t.upstreamUrl ?? null,
        upstreamLicense: t.upstreamLicense ?? null,
        isPubliclyReachable: t.isPubliclyReachable,
        publicUrl: t.publicUrl ?? null,
        technologies: [...t.technologies],
      },
    });

    await prisma.techProofEvidence.deleteMany({ where: { entryId: entry.id } });
    await prisma.techProofEvidence.createMany({
      data: t.evidence.map((e, index) => ({
        entryId: entry.id,
        label: e.label,
        value: e.value,
        source: e.source,
        order: index,
      })),
    });
  }
  console.log(`  cms: ${techProof.length} technology proof entries`);
}

async function seedProducts() {
  for (const p of products) {
    const seo = await prisma.seo.create({
      data: { title: p.seoTitle, description: p.seoDescription },
    });

    const product = await prisma.saasProduct.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        order: p.order,
        status: p.status,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        problem: p.problem,
        solution: p.solution,
        summary: p.summary,
        origin: p.origin,
        upstreamName: p.upstreamName ?? null,
        upstreamUrl: p.upstreamUrl ?? null,
        upstreamLicense: p.upstreamLicense ?? null,
        isPubliclyReachable: p.isPubliclyReachable,
        publicUrl: p.publicUrl ?? null,
        loginUrl: p.loginUrl ?? null,
        demoAvailable: p.demoAvailable,
        trialAvailable: p.trialAvailable,
        securityNotes: p.securityNotes ?? null,
        publishedAt: p.status === "LIVE" ? new Date() : null,
        seoId: seo.id,
      },
      update: {
        status: p.status,
        name: p.name,
        tagline: p.tagline,
        category: p.category,
        problem: p.problem,
        solution: p.solution,
        summary: p.summary,
        origin: p.origin,
        upstreamName: p.upstreamName ?? null,
        upstreamUrl: p.upstreamUrl ?? null,
        upstreamLicense: p.upstreamLicense ?? null,
        // Reachability and availability must be re-applied on update, not just
        // on create — otherwise correcting an over-claim in the content file
        // silently fails to reach a database that already has a row.
        isPubliclyReachable: p.isPubliclyReachable,
        publicUrl: p.publicUrl ?? null,
        loginUrl: p.loginUrl ?? null,
        demoAvailable: p.demoAvailable,
        trialAvailable: p.trialAvailable,
        securityNotes: p.securityNotes ?? null,
        publishedAt: p.status === "LIVE" ? new Date() : null,
      },
    });

    await prisma.productFeature.deleteMany({ where: { productId: product.id } });
    await prisma.productFeature.createMany({
      data: p.features.map((f, i) => ({
        productId: product.id,
        title: f.title,
        description: f.description,
        benefit: f.benefit ?? null,
        isShipped: f.isShipped,
        order: i,
      })),
    });

    await prisma.pricingPlan.deleteMany({ where: { productId: product.id } });
    for (const [i, plan] of p.plans.entries()) {
      const created = await prisma.pricingPlan.create({
        data: {
          productId: product.id,
          name: plan.name,
          description: plan.description,
          priceAmount: plan.priceAmount,
          pricePeriod: plan.pricePeriod,
          isCustom: plan.isCustom,
          isFeatured: plan.isFeatured,
          order: i,
        },
      });
      await prisma.planFeature.createMany({
        data: plan.features.map((label, fi) => ({ planId: created.id, label, order: fi })),
      });
    }

    await prisma.faq.deleteMany({ where: { productId: product.id } });
    await prisma.faq.createMany({
      data: p.faqs.map((f, i) => ({
        productId: product.id,
        question: f.question,
        answer: f.answer,
        scope: "product",
        order: i,
      })),
    });
  }

  const live = products.filter((p) => p.status === "LIVE").length;
  console.log(`  saas: ${products.length} products (${live} live, ${products.length - live} draft)`);

  // Renaming a slug in the content file creates a new row and orphans the old
  // one — the seed upserts by slug, so it cannot see the rename. Report rather
  // than delete: the seed cannot tell an orphan apart from a record an
  // operator created in the console, and silently removing someone's content
  // is a worse failure than leaving a stale draft.
  await warnOrphans(
    "saas product",
    products.map((p) => p.slug),
    (await prisma.saasProduct.findMany({ select: { slug: true } })).map((r) => r.slug),
  );
}

async function warnOrphans(kind: string, expected: string[], actual: string[]) {
  const orphans = actual.filter((slug) => !expected.includes(slug));
  if (orphans.length === 0) return;

  console.warn(
    `\n  ⚠ ${orphans.length} ${kind}(s) in the database are not in the content files:\n` +
      orphans.map((s) => `      ${s}`).join("\n") +
      `\n    Either they were created in the console (fine), or a slug was renamed\n` +
      `    and the old row is stale. Remove stale rows deliberately — the seed\n` +
      `    will not delete content it did not create.\n`,
  );
}

async function seedCaseStudies() {
  for (const c of caseStudies) {
    const solutionRecords = await prisma.solution.findMany({
      where: { slug: { in: [...c.solutionSlugs] } },
      select: { id: true },
    });

    const study = await prisma.caseStudy.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        status: "LIVE",
        title: c.title,
        summary: c.summary,
        challenge: c.challenge,
        strategy: c.strategy,
        technology: c.technology,
        implementation: c.implementation,
        result: c.result,
        lessons: c.lessons,
        // No consent on record, so no client is named anywhere.
        clientName: null,
        clientConsent: false,
        anonymousLabel: c.anonymousLabel,
        technologies: [...c.technologies],
        publishedAt: new Date(),
        solutions: { connect: solutionRecords.map((s) => ({ id: s.id })) },
      },
      update: {
        title: c.title,
        summary: c.summary,
        challenge: c.challenge,
        strategy: c.strategy,
        technology: c.technology,
        implementation: c.implementation,
        result: c.result,
        solutions: { set: solutionRecords.map((s) => ({ id: s.id })) },
      },
    });

    await prisma.caseStudyMetric.deleteMany({ where: { caseStudyId: study.id } });
    await prisma.caseStudyMetric.createMany({
      data: c.metrics.map((m, i) => ({
        caseStudyId: study.id,
        label: m.label,
        value: m.value,
        source: m.source,
        order: i,
      })),
    });
  }
  console.log(`  cms: ${caseStudies.length} case studies (all anonymised — no consent on record)`);
}

async function seedInsightsAndFaqs() {
  for (const i of insights) {
    const seo = await prisma.seo.create({
      data: {
        title: `${i.title} | Apex Global Tech Solution`,
        description: i.excerpt.slice(0, 155),
      },
    });

    await prisma.insight.upsert({
      where: { slug: i.slug },
      create: {
        slug: i.slug,
        status: "LIVE",
        title: i.title,
        excerpt: i.excerpt,
        body: i.body,
        category: i.category,
        readingMinutes: i.readingMinutes,
        authorName: i.authorName,
        authorRole: i.authorRole,
        publishedAt: new Date(),
        seoId: seo.id,
      },
      update: { title: i.title, excerpt: i.excerpt, body: i.body },
    });
  }

  await prisma.faq.deleteMany({ where: { scope: "general" } });
  await prisma.faq.createMany({
    data: faqs.map((f, i) => ({
      question: f.question,
      answer: f.answer,
      scope: "general",
      order: i,
      status: "LIVE" as const,
    })),
  });

  console.log(`  cms: ${insights.length} insights, ${faqs.length} general FAQs`);
}

async function seedLandingPages() {
  for (const l of landingPages) {
    await prisma.landingPage.upsert({
      where: { slug: l.slug },
      create: {
        slug: l.slug,
        status: "LIVE",
        headline: l.headline,
        subheadline: l.subheadline,
        ctaLabel: l.ctaLabel,
        bullets: [...l.bullets],
        campaignName: l.campaignName,
        solutionSlug: l.solutionSlug,
      },
      update: {
        headline: l.headline,
        subheadline: l.subheadline,
        bullets: [...l.bullets],
      },
    });
  }
  console.log(`  cms: ${landingPages.length} ad landing pages (noindex)`);
}

async function main() {
  console.log("Seeding Apex Global platform\n");

  await seedCore();
  await seedSolutions();
  await seedIndustries();
  await seedTechProof();
  await seedProducts();
  await seedCaseStudies();
  await seedInsightsAndFaqs();
  await seedLandingPages();

  console.log("\nRunning credibility assertions...");
  const violations = await assertCredibility(prisma);

  if (violations.length > 0) {
    console.error(`\n${violations.length} credibility violation(s):\n`);
    for (const v of violations) console.error(`  ✗ [${v.rule}] ${v.entity}: ${v.detail}`);
    console.error("\nSeed aborted. See docs/CREDIBILITY.md.");
    process.exitCode = 1;
    return;
  }

  console.log("  ✓ All published content passes the credibility rules.\n");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
