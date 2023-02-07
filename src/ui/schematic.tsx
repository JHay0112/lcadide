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
            sheet.activeComponent.position = sheet.toGrid([event.clientX, event.clientY]);
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

    // SVG based grid adapted from:
    // https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg
    return (<>
        <section 
            class={`h-full w-full overflow-scroll ${sheet.active? "cursor-grabbing" : "cursor-auto"}`} 
            onMouseMove={handleMouseMove} 
            onClick={handleMouseClick}
        >
            <svg class="h-full w-full">
                <defs>
                    <pattern id="grid" width={sheet.gridSpacing} height={sheet.gridSpacing} patternUnits="userSpaceOnUse">
                        <path d={`M ${sheet.gridSpacing} 0 L 0 0 0 ${sheet.gridSpacing}`} fill="none" stroke="gray" stroke-width="1" />
                    </pattern>
                </defs>
                    
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
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