/**
 * Scale a human‑readable total‑supply value by 10^decimals.
 *
 * Overloads
 * ──────────
 * 1. `scaleSupply(value, decimals)`              → **bigint**
 * 2. `scaleSupply(value, decimals, false)`       → **bigint**
 * 3. `scaleSupply(value, decimals, true)`        → **string**
 *
 * @param {string | number | bigint} value    Raw value like "123.45", 42, 0.1 …
 * @param {number}                decimals    Token decimals (0 – 255)
 * @param {boolean}  [asString=false]         `true` ⇒ return a string, else bigint
 *
 * @returns {bigint | string} Units scaled by 10^decimals (type depends on `asString`)
 *
 * @throws {Error} If `value` has more fractional digits than `decimals`
 *
 * @example
 *   const a = scaleSupply("1.5", 6);          // 1500000n
 *   const b = scaleSupply(42, 6, false);      // 42000000n
 *   const c = scaleSupply("0.1", 6, true);    // "100000"
 */
export function scaleSupply(
  value: string | number | bigint,
  decimals: number
): bigint;
export function scaleSupply(
  value: string | number | bigint,
  decimals: number,
  asString: false
): bigint;
export function scaleSupply(
  value: string | number | bigint,
  decimals: number,
  asString: true
): string;

/* ───────────────────────── Implementation ───────────────────────── */
export function scaleSupply(
  value: string | number | bigint,
  decimals: number,
  asString: boolean = false
): string | bigint {
  const [intPart, fracPart = ""] = value.toString().split(".");

  if (fracPart.length > decimals) {
    throw new Error("too many decimal places for the chosen `decimals`");
  }

  const units = BigInt((intPart || "0") + fracPart.padEnd(decimals, "0"));

  return asString ? units.toString() : units;
}
