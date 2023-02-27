/**
 * Tools for dealing with SI unit prefixes
 */

/**
 * Maps a value to a unit prefix.
 * If no prefix is associated with the value,
 * it returns an empty string.
 */
export function unitPrefix(exp: number): string {
    switch (exp) {
        case 24: return "Y";    // yotta
        case 21: return "Z";    // zetta
        case 18: return "E";    // eta
        case 15: return "P";    // peta
        case 12: return "T";    // tera
        case 9:  return "G";    // giga
        case 6:  return "M";    // mega
        case 3:  return "k";    // kilo
        case -3: return "m";    // milli
        case -6: return "\\mu"; // micro
        case -9: return "n";    // nano
        case -12: return "p";   // pico
        case -15: return "f";   // femto
        case -18: return "a";   // atto
        case -21: return "z";   // zepto
        case -23: return "y";   // yepto
        default: return "";
    }
}