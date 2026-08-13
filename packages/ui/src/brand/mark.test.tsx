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

  it("keeps every path static (no animation classes) by default", () => {
    const { container } = render(<Mark />);
    for (const path of container.querySelectorAll("path")) {
      expect(path.getAttribute("class")).toBeNull();
    }
  });

  it("adds the sweep + peak animation classes when animated", () => {
    const { container } = render(<Mark animated />);
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(4);
    expect(container.querySelector(".apex-peak")).not.toBeNull();
    expect(container.querySelectorAll(".apex-sweep")).toHaveLength(3);
    expect(container.querySelectorAll(".apex-sweep-0")).toHaveLength(1);
    expect(container.querySelectorAll(".apex-sweep-1")).toHaveLength(1);
    expect(container.querySelectorAll(".apex-sweep-2")).toHaveLength(1);
  });
});

describe("Logo", () => {
  it("renders the full wordmark", () => {
    render(<Logo />);
    expect(screen.getByText("APEX GLOBAL")).toBeInTheDocument();
    expect(screen.getByText("TECH SOLUTION")).toBeInTheDocument();
  });

  it("does not force animation on the mark unless asked", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg .apex-peak")).toBeNull();
    expect(container.querySelector(".apex-logo")).toBeNull();
  });

  it("forwards animated to the mark", () => {
    const { container } = render(<Logo animated />);
    expect(container.querySelector(".apex-logo")).not.toBeNull();
    expect(container.querySelector(".apex-peak")).not.toBeNull();
  });
});
