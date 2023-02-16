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

/**
 * Maps a unit prefix to an exponent value.
 * If no prefix is associated with the value,
 * it returns the value 0.
 */
export function prefixValue(prefix: string): number {
    switch(prefix) {
        case "Y": return 24;
        case "Z": return 21;
        case "E": return 18;
        case "P": return 15;
        case "T": return 12;
        case "G": return 9;
        case "M": return 6;
        case "k": return 3;
        case "m": return -3;
        case "\\mu": return -6;
        case "n": return -9;
        case "p": return -12;
        case "f": return -15;
        case "a": return -18;
        case "z": return -21;
        case "y": return -23;
        default:  return 0;
    }
}