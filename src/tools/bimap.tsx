/**
 * Produces a bidirectional map type.
 */

/**
 * Bidirectional single-to-many map.
 */
export default class BiMap<T> {

    protected readonly map: Map<T, Array<T>> = new Map();

    /**
     * Determines if the key exists in the map.
     */
    has(key: T): boolean {
        return this.map.has(key);
    }

    /**
     * Adds a new bidirectional pairing.
     */
    add(key: T, value: T) {
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
    get(key: T): Array<T> {
        return this.map.get(key);
    }

    /**
     * Deletes a key from all entries
     */
    delete(key: T) {
        // if the key exists
        if (this.has(key)) {
            // find its partners
            const partners = this.get(key);
            // go through each and remove the key from their list
            partners.forEach((partner) => {
                let list = this.get(partner).slice();
                const i = list.indexOf(key);
                this.map.set(partner, list.splice(i, 1));
            });
            // finally delete the key
            this.map.delete(key);
        }
    }

}