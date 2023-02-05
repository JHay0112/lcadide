/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For } from "solid-js";

import Sheet from "../model/sheet";
import Component from "../model/cpts/cpt";

/**
 * Canvas that draws schematics from a sheet
 */
export default function Canvas(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    // track the actively selected component
    let activeComponent: Component = null;

    return (<>
        <section class="h-full w-full overflow-scroll">
            <For each={sheet.components}>{(component) =>
                component.forDisplay()
            }</For>
        </section>
    </>);
}