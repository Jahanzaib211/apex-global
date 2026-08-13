import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";
import { cn } from "../lib/cn";

const CONTROL =
  "w-full rounded-[var(--radius-md)] border bg-[var(--bg-raised)] px-3.5 py-2.5 " +
  "text-[0.9375rem] text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] " +
  "border-[var(--border-default)] transition-colors duration-[var(--duration-fast)] " +
  "hover:border-[var(--border-strong)] focus:border-[var(--accent)] " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const INVALID = "border-[var(--color-danger-500)] hover:border-[var(--color-danger-500)]";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

function FieldShell({ id, label, hint, error, required, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-[var(--ink-primary)]">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-[var(--color-danger-500)]">
            *
          </span>
        ) : (
          <span className="text-2xs ml-1.5 font-normal text-[var(--ink-muted)]">optional</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-[var(--color-danger-500)]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-[var(--ink-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Wires label, hint, error and aria-* together so it is accessible by default. */
function useFieldA11y(id: string, hint?: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  wrapperClassName,
  ...props
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <input
        {...useFieldA11y(id, hint, error)}
        required={required}
        className={cn(CONTROL, error && INVALID, className)}
        {...props}
      />
    </FieldShell>
  );
}

export interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  wrapperClassName,
  rows = 4,
  ...props
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <textarea
        {...useFieldA11y(id, hint, error)}
        required={required}
        rows={rows}
        className={cn(CONTROL, "resize-y", error && INVALID, className)}
        {...props}
      />
    </FieldShell>
  );
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder?: string;
}

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  wrapperClassName,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <select
        {...useFieldA11y(id, hint, error)}
        required={required}
        defaultValue={props.defaultValue ?? ""}
        className={cn(CONTROL, "appearance-none pr-9", error && INVALID, className)}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * Off-screen honeypot. Bots fill it, humans never see it.
 * Deliberately not `display:none` — some bots skip hidden inputs.
 */
export function HoneypotField({ name = "company_website" }: { name?: string }) {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor={name}>Leave this field empty</label>
      <input id={name} name={name} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
