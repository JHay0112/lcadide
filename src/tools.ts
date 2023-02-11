/**
 * Custom generic tool classes and methods
 */

import { Position } from "./types";

/**
 * Maps a position to a value.
 * 
 * This should behave in the same way as a typical Map object
 * but bases position equality on the numbers and not the position instance
 */
export class PositionMap<T> {

    private map = new Map<number, Map<number, T>>();

    has(key: Position): boolean {
        if (this.map.has(key[0])) {
            if (this.map.get(key[0]).has(key[1])) {
                return true;
            }
        }
        return false;
    }

    set(key: Position, value: T) {
        if (!this.has(key) && !this.map.has(key[0])) {
            this.map.set(key[0], new Map<number, T>());
        }
        this.map.get(key[0]).set(key[1], value);
    }

    get(key: Position): T {
        if (this.map.has(key[0])) {
            return this.map.get(key[0]).get(key[1]);
        }
        return undefined;
    }

    delete(key: Position): boolean {
        if (this.map.has(key[0])) {
            return this.map.get(key[0]).delete(key[1]);
        }
        return false;
    }

    keys() {
        let k: Position[] = [];
        Array.from(this.map.keys()).forEach((x) => {
            Array.from(this.map.get(x).keys()).forEach((y) => {
                k = [...k, [x, y]];
            });
        });
        return k;
    }

    copy(): PositionMap<T> {
        let newMap = new PositionMap<T>();
        this.keys().forEach((key) => {
            newMap.set(key, this.get(key));
        });
        return newMap;
    }
}

/**
 * Maps a value to a unit prefix.
 * If no prefix is associated with the value,
 * it returns an empty string.
 */
export function unitPrefix(exp: number): string {
    switch (exp) {
        case 24: return "Y";   // yotta
        case 21: return "Z";   // zetta
        case 18: return "E";   // eta
        case 15: return "P";   // peta
        case 12: return "T";   // tera
        case 9:  return "G";   // giga
        case 6:  return "M";   // mega
        case 3:  return "k";   // kilo
        case -3: return "m";   // milli
        case -6: return "\\mu"; // micro
        case -9: return "n";   // nano
        case -12: return "p";  // pico
        case -15: return "f";  // femto
        case -18: return "a";  // atto
        case -21: return "z";  // zepto
        case -23: return "y";  // yepto
        default: return "";
    }
}