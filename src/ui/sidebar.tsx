/**
 * Defines a generic sidebar
 */

import { Resource, splitProps } from "solid-js";
import { PyodideInterface } from "pyodide";

import Terminal from "../py/terminal";

/**
 * Editor sidebar
 * Includes a list of the current components (TODO)
 * and the terminal emulator
 */
export default function Sidebar(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["py"]);
    let py: Resource<PyodideInterface> = local.py;

    return (<>
        <section class="h-1/2 w-full">
            Components list...
        </section>
        <section class="h-1/2 w-full dark">
            <Terminal py={py} />
        </section>
    </>);
}