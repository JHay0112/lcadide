/**
 * Defines a generic sidebar
 */

import Terminal from "../py/terminal";

/**
 * Editor sidebar
 * Includes a list of the current components (TODO)
 * and the terminal emulator
 */
export default function Sidebar() {

    return (<>
        <section class="h-full md:h-1/2 w-full">
            Components list...
        </section>
        <section class="h-full md:h-1/2 w-full dark">
            <Terminal />
        </section>
    </>);
}