/**
 * Provides the editor interface
 */

import { createSignal, splitProps } from "solid-js";

import Sidebar from "./sidebar";
import Schematic from "./schematic";
import Components from "./components";

import Sheet from "../model/sheet";
import Terminal from "../py/terminal";

/**
 * Editor
 * Provides an interface for users to select, place, and edit schematics
 */
export default function Editor(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    // track sidebar collapse state
    const [collapsed, setCollapsed] = createSignal(false);

    return (<>
        <Schematic 
            sheet={sheet} 
            class={`h-screen inline-block align-top w-full ${collapsed()? "" : "md:w-2/3 lg:w-3/4"} transition-all`} 
        />
        <Sidebar 
            class={`h-screen inline-block align-top ${collapsed()? "w-0" : "w-full md:w-1/3 lg:w-1/4"} transition-all`}
        >
            <Components sheet={sheet} />
            <Terminal />
        </Sidebar>
        <button
            class={`none md:block h-primary bg-primary p-3 transition-all absolute top-0 
                rounded-bl-md font-mono justify-center
                ${collapsed()? "right-0" : "md:right-1/3 lg:right-1/4"}
            `}
            onClick={() => {setCollapsed(!collapsed())}}
        >...</button>
    </>);
}