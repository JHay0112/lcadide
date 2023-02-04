/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For } from "solid-js";

import Sheet from "../model/sheet";

/**
 * Canvas that draws schematics from a sheet
 */
export default function Canvas(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <section class="h-full w-full overflow-scroll">
            <For each={sheet.components}>{(component) =>
                component.forDisplay()
            }</For>
        </section>
    </>);
}