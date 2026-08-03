import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, Mark } from "./mark";

describe("Mark", () => {
  it("is hidden from assistive tech when decorative", () => {
    const { container } = render(<Mark />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("role", "presentation");
  });

  it("becomes a labelled image when given a title", () => {
    render(<Mark title="Apex Global Tech Solution" />);
    const svg = screen.getByRole("img", { name: "Apex Global Tech Solution" });
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("draws the peak plus three sweeps", () => {
    const { container } = render(<Mark />);
    expect(container.querySelectorAll("path")).toHaveLength(4);
  });

  it("scales from a viewBox rather than fixed dimensions", () => {
    const { container } = render(<Mark />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 160 100");
    expect(svg).not.toHaveAttribute("width");
  });

  it("uses currentColor throughout in mono so it inherits its context", () => {
    const { container } = render(<Mark variant="mono" />);
    for (const path of container.querySelectorAll("path")) {
      expect(path.getAttribute("fill")).toBe("currentColor");
    }
  });
});

describe("Logo", () => {
  it("renders the full wordmark", () => {
    render(<Logo />);
    expect(screen.getByText("APEX GLOBAL")).toBeInTheDocument();
    expect(screen.getByText("TECH SOLUTION")).toBeInTheDocument();
  });
});
