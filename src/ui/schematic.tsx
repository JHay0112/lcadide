/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For, Show, onMount } from "solid-js";

import Symbol from "./symbol";

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

    // do a resize onload
    onMount(() => {
        sheet.gridSpacing = Math.max(container.clientWidth / 80, 20);
    });

    // SVG based grid adapted from:
    // https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg
    return (<>
        <section 
            ref={container}
            class={`${sheet.active? "cursor-grabbing" : "cursor-auto"} ${local.class} overflow-y-hidden`} 
            onMouseMove={(event) => {
                if (sheet.active) {
                sheet.activeComponent.position = sheet.toGrid([event.clientX, event.clientY]);
                }
            }} 
            onMouseUp={() => {
                if (sheet.active) {
                    sheet.placeActiveComponent();
                }
            }}
            onMouseLeave={() => {
                if (sheet.active) {
                    sheet.placeActiveComponent();
                }
            }}
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

            <For each={sheet.nodes}>{(node) =>
                <svg 
                    height="5"
                    width="5"
                    style={`   
                        position: absolute;
                        top: ${sheet.toPixels(node)[1] - 2.5}px;
                        left: ${sheet.toPixels(node)[0] - 2.5}px;
                    `}
                    class="dark:invert"
                >
                    <Show when={sheet.connections(node) > 2 || sheet.connections(node) == 1}>
                        <circle cx="2.5" cy="2.5" r="2.5" style={`stroke: black; fill: ${sheet.connections(node) > 2? "black" : "white"};`} />
                    </Show>
                </svg>
            }</For>
        </section>
    </>);
}