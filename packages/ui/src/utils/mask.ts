/**
 * Input masks. Tokens: `9` digit, `a` letter, `*` letter or digit; anything else is a literal.
 * e.g. `9999 9999 9999 9999`, `99/99`, `+62 999-9999-9999`, `aa-9999`.
 */
const TOKENS: Record<string, RegExp> = { '9': /\d/, a: /[A-Za-z]/, '*': /[A-Za-z0-9]/ }

/** The characters the user actually typed, with mask literals removed. */
export function unmask(value: string, mask: string): string {
  let raw = ''
  let m = 0
  for (const ch of value) {
    // Skip past literals the value already contains (or is missing).
    while (m < mask.length && !TOKENS[mask[m]!] && mask[m] !== ch) m++
    if (m < mask.length && !TOKENS[mask[m]!] && mask[m] === ch) {
      m++
      continue
    }
    const token = TOKENS[mask[m] ?? '']
    if (token?.test(ch)) {
      raw += ch
      m++
    }
  }
  return raw
}

/** Format typed characters into the mask, stopping where the input runs out. */
export function applyMask(value: string, mask: string): string {
  const raw = unmask(value, mask)
  let out = ''
  let i = 0
  for (const m of mask) {
    if (i >= raw.length) break
    const token = TOKENS[m]
    if (!token) {
      out += m
      continue
    }
    while (i < raw.length && !token.test(raw[i]!)) i++
    if (i >= raw.length) break
    out += raw[i++]
  }
  return out
}
