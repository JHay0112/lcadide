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
}