/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For, Show, onMount } from "solid-js";

import Symbol from "./symbol";
import Toolbar from "./toolbar";

import Sheet from "../model/sheet";

/**
 * Canvas that draws schematics from a sheet
 */
export default function Schematic(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet", "class"]);
    let sheet: Sheet = local.sheet;

    // reference to container element
    let container;

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

    // do a resize onload
    onMount(() => {
        sheet.gridSpacing = container.clientWidth / 80;
    });

    // SVG based grid adapted from:
    // https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg
    return (<>
        <section 
            ref={container}
            class={`overflow-scroll ${sheet.active? "cursor-grabbing" : "cursor-auto"} ${local.class}`} 
            onMouseMove={handleMouseMove} 
            onClick={handleMouseClick}
        >
            <svg class="h-full w-full">
                <defs>
                    <pattern id="grid" width={sheet.gridSpacing} height={sheet.gridSpacing} patternUnits="userSpaceOnUse">
                        <path d={`M ${sheet.gridSpacing} 0 L 0 0 0 ${sheet.gridSpacing}`} fill="none" stroke="gray" stroke-width="0.5" />
                    </pattern>
                </defs>
                    
                <rect class="dark:invert" width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <Show when={sheet.active}>
                <Symbol component={sheet.activeComponent} sheet={sheet} />
            </Show>
            <For each={sheet.components}>{(component) =>
                <Symbol component={component} sheet={sheet} />
            }</For>
        </section>
        <Toolbar sheet={sheet} />
    </>);
}