/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For, Show } from "solid-js";

import Toolbar from "./toolbar";

import Sheet from "../model/sheet";

/**
 * Canvas that draws schematics from a sheet
 */
export default function Schematic(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    /**
     * Handles mouse movements.
     * This will update the position of the active component wrt the mouse.
     */
    function handleMouseMove(event) {
        if (sheet.active) {
            // TODO: Include grid snapping
            sheet.activeComponent.position = [event.clientY, event.clientX];
        }
    }

    /**
     * Handles mouse clicks
     */
    function handleMouseClick(event) {
        if (sheet.active) {
            sheet.placeActiveComponent();
        }
    }

    return (<>
        <section class="h-full w-full overflow-scroll" onMouseMove={handleMouseMove} onClick={handleMouseClick}>
            <Show when={sheet.active}>
                {sheet.activeComponent.forDisplay()}
            </Show>
            <For each={sheet.components}>{(component) =>
                component.forDisplay()
            }</For>
        </section>
        <Toolbar sheet={sheet} />
    </>);
}