import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ButtonLink } from "./button";

describe("Button", () => {
  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Talk to our technology team</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("honours an explicit submit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls the handler on click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Request a demo</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Send
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("lets caller classes override variant defaults", () => {
    render(<Button className="h-20">Tall</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("h-20");
    expect(cls).not.toContain("h-11");
  });
});

describe("ButtonLink", () => {
  it("renders an anchor so navigation stays real navigation", () => {
    render(<ButtonLink href="/solutions">Explore our solutions</ButtonLink>);
    const link = screen.getByRole("link", { name: "Explore our solutions" });
    expect(link).toHaveAttribute("href", "/solutions");
  });
});
