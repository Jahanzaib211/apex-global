/**
 * Safe serialisation for `<script type="application/ld+json">` blocks.
 *
 * Every page in the estate emits structured data, and every one of them did it
 * the obvious way:
 *
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *
 * That is a real hole, not a theoretical one. `JSON.stringify` escapes for
 * JSON, not for HTML, so it happily emits the literal characters `</script>`
 * inside a script element. The HTML parser terminates the script at that
 * sequence regardless of the JSON context around it, and everything after it
 * is parsed as markup. Any schema field carrying text we did not author — a
 * job title, an article headline, a service description out of the database —
 * is enough to reach it.
 *
 * The escaping below is the standard fix and it is deliberately small:
 *
 *   `<` and `>`  close the script element early.
 *   `&`          would let an HTML entity reconstruct one of the above.
 *   U+2028/2029  are literal line terminators in JavaScript but legal raw
 *                inside a JSON string; leaving them intact is a syntax error
 *                in older parsers.
 *
 * All four escapes are valid JSON escape sequences, so the payload a crawler
 * parses is byte-for-byte the object that went in. Nothing is stripped, and
 * the function is total — there is no input for which it silently drops data.
 *
 * `dangerouslySetInnerHTML` remains the only React API that can write a script
 * body, so it has not gone away — it has moved. `jsonLdProps` below is now the
 * one place in the repository that names it, on an already-escaped payload,
 * which is the difference between one sink to review and twenty-six.
 */

/** JSON-LD is a plain JSON document; this is the shape of one. */
export type JsonLdValue =
  string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };

// The class is written with escape sequences rather than literal characters:
// U+2028 and U+2029 are invisible in an editor, and a rule nobody can see is a
// rule somebody eventually deletes.
const UNSAFE_IN_SCRIPT = /[<>&\u2028\u2029]/g;

/**
 * Serialise a structured-data object for embedding in a script element.
 *
 * @param data the JSON-LD graph
 * @returns JSON, escaped so it cannot terminate the surrounding `<script>`
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(
    UNSAFE_IN_SCRIPT,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}

/**
 * The props for a JSON-LD `<script>`, ready to spread:
 *
 *   <script type="application/ld+json" {...jsonLdProps(schema)} />
 *
 * This exists so that `dangerouslySetInnerHTML` appears exactly once in the
 * repository — here, on an escaped payload — instead of in twenty-odd page
 * components where each one is a separate thing to get right and a separate
 * thing to review. It is a plain object, not a component, so the four sites
 * and the console can all share it without site-kit taking on React.
 */
export function jsonLdProps(data: unknown): {
  dangerouslySetInnerHTML: { __html: string };
} {
  // The audited sink. Suppressed here and nowhere else: the payload cannot
  // reach it unescaped, because escaping is the only way in.
  // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
  return { dangerouslySetInnerHTML: { __html: jsonLdScript(data) } };
}
