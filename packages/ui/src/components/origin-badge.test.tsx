import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OriginBadge } from "./origin-badge";

/**
 * These assertions exist because the badge is a compliance control, not
 * decoration. If provenance stops rendering, the site starts making claims it
 * cannot defend. See docs/CREDIBILITY.md.
 */
describe("OriginBadge", () => {
  it("states plainly when Apex built the thing", () => {
    render(<OriginBadge origin="BUILT_BY_APEX" />);
    expect(screen.getByText("Built by Apex")).toBeInTheDocument();
  });

  it("distinguishes operating software from having written it", () => {
    render(<OriginBadge origin="OPERATED_BY_APEX" />);
    expect(screen.getByText("Operated by Apex")).toBeInTheDocument();
    expect(screen.queryByText("Built by Apex")).not.toBeInTheDocument();
  });

  it("never implies authorship of third-party open source", () => {
    render(<OriginBadge origin="THIRD_PARTY_OSS" />);
    expect(screen.getByText("Third-party open source")).toBeInTheDocument();
    expect(screen.queryByText(/built by apex/i)).not.toBeInTheDocument();
  });

  it("credits the upstream project and its licence for derived work", () => {
    render(
      <OriginBadge
        origin="BUILT_BY_APEX"
        upstreamName="DeerFlow"
        upstreamUrl="https://github.com/bytedance/deer-flow"
        upstreamLicense="MIT"
      />,
    );

    const link = screen.getByRole("link", { name: "DeerFlow" });
    expect(link).toHaveAttribute("href", "https://github.com/bytedance/deer-flow");
    expect(screen.getByText(/MIT/)).toBeInTheDocument();
  });

  it("marks outbound upstream links as untrusted", () => {
    render(
      <OriginBadge
        origin="BUILT_BY_APEX"
        upstreamName="Upstream"
        upstreamUrl="https://example.com"
      />,
    );
    const rel = screen.getByRole("link", { name: "Upstream" }).getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("nofollow");
  });

  it("omits attribution entirely when there is no upstream", () => {
    render(<OriginBadge origin="BUILT_BY_APEX" />);
    expect(screen.queryByText(/built on/i)).not.toBeInTheDocument();
  });
});
