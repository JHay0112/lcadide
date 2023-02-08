/**
 * Provides the editor interface
 */

import { splitProps } from "solid-js";

import Sidebar from "./sidebar";
import Schematic from "./schematic";

import Sheet from "../model/sheet";
import Terminal from "../py/terminal";

/**
 * Editor
 * Provides an interface for users to select, place, and edit schematics
 */
export default function Editor(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <Schematic sheet={sheet} class="h-screen w-full md:w-2/3 inline-block align-top" />
        <Sidebar class="h-screen w-full md:w-1/3 inline-block align-top">
            <section>
                Sheet componenents
            </section>
            <Terminal />
        </Sidebar>
    </>);
}