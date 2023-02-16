/**
 * Produces a special map type that can deal with positions.
 */

import { Position } from "../types";

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
 * Bidirectional single-to-many map for positions.
 */
export class PositionBiMap {

    private readonly map: PositionMap<Position[]> = new PositionMap();

    /**
     * Determines if the key exists in the map.
     */
    has(key: Position): boolean {
        return this.map.has(key);
    }

    /**
     * Adds a new bidirectional pairing.
     */
    add(key: Position, value: Position) {
        // first add for the "key"
        if (this.has(key)) {
            this.map.set(key, [...this.map.get(key), value]);
        } else {
            this.map.set(key, [value]);
        }

        // and then for the "value"
        if (this.has(value)) {
            this.map.set(value, [...this.map.get(value), key]);
        } else {
            this.map.set(value, [key]);
        }
    }

    /**
     * Produces a list of values that the key is associated with
     */
    get(key: Position): Position[] {
        return this.map.get(key);
    }

    /**
     * Deletes a key from all entries
     */
    delete(key: Position) {
        // if the key exists
        if (this.has(key)) {
            // find its partners
            const partners = this.get(key);
            // go through each and remove the key from their list
            partners.forEach((partner) => {

                let list = this.get(partner).slice();
                let i = -1;

                list.forEach((pos, j) => {
                    if (
                        pos[0] == key[0] &&
                        pos[1] == key[1]
                    ) {
                        i = j;
                    }  
                });

                list.splice(i, 1);
                this.map.set(partner, list);
            });
            // finally delete the key
            this.map.delete(key);
        }
    }

}