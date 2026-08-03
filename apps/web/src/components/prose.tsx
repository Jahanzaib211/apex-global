/**
 * Renders the lightweight markdown subset the CMS stores: paragraphs, blank-line
 * breaks, and **bold** runs. Deliberately not a full markdown parser — content
 * is authored in our own console, and a parser is an injection surface plus a
 * dependency we would have to keep patched for no gain.
 */
export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);

  return (
    <div className={`flex max-w-[var(--container-prose)] flex-col gap-5 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-[1.0625rem] leading-[1.75] text-[var(--ink-secondary)]">
          {renderBold(p)}
        </p>
      ))}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-[var(--ink-primary)]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
