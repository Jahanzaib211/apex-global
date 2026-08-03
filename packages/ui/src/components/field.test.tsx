import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HoneypotField, SelectField, TextAreaField, TextField } from "./field";

describe("TextField", () => {
  it("associates its label with the control", () => {
    render(<TextField label="Work email" name="email" />);
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
  });

  it("points aria-describedby at the hint when valid", () => {
    render(<TextField label="Company" hint="Legal entity name" name="company" />);
    const input = screen.getByLabelText(/company/i);
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent("Legal entity name");
  });

  it("switches aria-describedby to the error and announces it", () => {
    render(<TextField label="Work email" error="Enter a valid email address" name="email" />);
    const input = screen.getByLabelText(/work email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address");
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByRole("alert").id);
  });

  it("marks non-required fields as optional rather than leaving it ambiguous", () => {
    render(<TextField label="Phone" name="phone" />);
    expect(screen.getByText("optional")).toBeInTheDocument();
  });

  it("generates unique ids so two instances never collide", () => {
    render(
      <>
        <TextField label="First name" name="first" />
        <TextField label="Last name" name="last" />
      </>,
    );
    const a = screen.getByLabelText(/first name/i).id;
    const b = screen.getByLabelText(/last name/i).id;
    expect(a).not.toBe(b);
  });
});

describe("TextAreaField", () => {
  it("renders a textarea bound to its label", () => {
    render(<TextAreaField label="Project requirements" name="message" />);
    expect(screen.getByLabelText(/project requirements/i).tagName).toBe("TEXTAREA");
  });
});

describe("SelectField", () => {
  it("renders every option and a disabled placeholder", () => {
    render(
      <SelectField
        label="Company size"
        name="size"
        placeholder="Select company size"
        options={[
          { value: "1-10", label: "1-10" },
          { value: "11-50", label: "11-50" },
        ]}
      />,
    );

    expect(screen.getByRole("option", { name: "Select company size" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "1-10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "11-50" })).toBeInTheDocument();
  });
});

describe("HoneypotField", () => {
  it("stays out of the accessibility tree but present in the DOM for bots", () => {
    const { container } = render(<HoneypotField />);
    const wrapper = container.firstElementChild!;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('input[name="company_website"]')).toBeInTheDocument();
  });

  it("is not reachable by keyboard", () => {
    const { container } = render(<HoneypotField />);
    expect(container.querySelector("input")).toHaveAttribute("tabindex", "-1");
  });
});
