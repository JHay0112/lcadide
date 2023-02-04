/**
 * Provides the editor interface
 */

import { splitProps } from "solid-js";

import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import Sheet from "../model/sheet";

/**
 * Editor
 * Provides an interface for users to select, place, and edit schematics
 */
export default function Editor(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    return (
        <>
            <section class="h-screen w-full md:w-2/3 inline-block align-top">
                <section class="">
                    Editing canvas...
                </section>
                <Toolbar sheet={sheet} />
            </section>
            <aside class="h-screen w-full md:w-1/3 inline-block align-top">  
                <Sidebar />
            </aside>
        </>
    );
}