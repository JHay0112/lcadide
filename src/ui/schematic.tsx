/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For, Show, onMount, createSignal } from "solid-js";

import { Orientation, Position } from "../types";

import Sheet from "../model/sheet";

import Symbol from "./symbol";

import Wire from "../model/components/wire";
import Ground from "../model/components/ground";
import Resistor from "../model/components/resistor";
import Inductor from "../model/components/inductor";
import Capacitor from "../model/components/capacitor";
import VoltageSource from "../model/components/voltage_source";
import CurrentSource from "../model/components/current_source";

/**
 * Handler for placing the active component of the sheet.
 * This is mainly to introduce special code of handling wire placement which is special.
 * 
 * Parameters
 * ----------
 * @param sheet 
 *  The sheet to place down the active component of.
 * @param position
 *  The position to place the active component at.
 */
function placeActiveComponent(sheet: Sheet, position: Position) {
    if (sheet.activeComponent instanceof Wire) {
        if (!sheet.activeComponent.endPlaced) {
            // place the start of the wire
            sheet.activeComponent.end = sheet.toGrid(position);
            sheet.activeComponent.endPlaced = true;
        } else {
            // if wire fails to initialise then do not place
            const start = sheet.activeComponent.start;
            const end = sheet.activeComponent.end;
            if (
                ((start[0] == -255) && (start[1] == -255)) ||
                ((end[0] == -255) && (end[1] == -255))
            ) {
                sheet.active = false;
            } else {
                sheet.placeActiveComponent();
            }
        }
    } else {
        sheet.placeActiveComponent();
    }
}

/**
 * Handler for updating the position of the active component of a sheet.
 * This is mainly to introduce special code for handling the wires and orientation.
 * 
 * Parameters
 * ----------
 * @param sheet 
 *  The sheet to move the active component of.
 * @param position
 *  The position to move the active component to.
 */
function updateActiveComponent(sheet: Sheet, position: Position) {
    if (sheet.activeComponent instanceof Wire) {
        if (sheet.activeComponent.endPlaced) {
            sheet.activeComponent.start = sheet.toGrid(position);
        }
    } else {
        // non-wires (i.e. orientable components)
        const middle = sheet.toPixels(sheet.activeComponent.middle);

        if (sheet.activeComponent.orientation == Orientation.HORIZONTAL) {
            sheet.activeComponent.position = sheet.toGrid([
                position[0] - middle[1], 
                position[1] - middle[0]
            ]);
        } else {
            sheet.activeComponent.position = sheet.toGrid([
                position[0] - middle[0], 
                position[1] - middle[1]
            ]);
        }
    }
}

/**
 * Canvas that draws schematics from a sheet
 */
export default function Schematic(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet", "class"]);
    let sheet: Sheet = local.sheet;

    // tracks the position of the moust
    let [mousePosition, setMousePosition] = createSignal([-255, -255] as Position);

    // reference to container element
    let container;

    // do a resize onload
    onMount(() => {
        sheet.gridSpacing = Math.max(container.clientWidth / 80, 20);
    });

    // handles mouse movements
    function handleMouseMove(event) {
        // terrible, terrible side effect :(
        setMousePosition([event.clientX, event.clientY]);
        if (sheet.active) {
            updateActiveComponent(sheet, mousePosition());
        }
    } 

    onMount(() => {
        // keybindings
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                    sheet.activeComponent = new Wire(sheet);
                    break;
                case "g":
                    sheet.activeComponent = new Ground(sheet);
                    break;
                case "r":
                    sheet.activeComponent = new Resistor(sheet);
                    break;
                case "l":
                    sheet.activeComponent = new Inductor(sheet);
                    break;
                case "c":
                    sheet.activeComponent = new Capacitor(sheet);
                    break;
                case "v":
                    sheet.activeComponent = new VoltageSource(sheet);
                    break;
                case "i":
                    sheet.activeComponent = new CurrentSource(sheet);
                    break;
                case "z":
                    if (sheet.active && !(sheet.activeComponent instanceof Wire)) {
                        sheet.activeComponent.rotate();
                    }
                    break;
                case "Delete":
                case "Escape":
                    sheet.active = false;
                    break;
            }
            if (sheet.active) {
                // update any freshly placed components
                updateActiveComponent(sheet, mousePosition());
            }
        });
    })

    // SVG based grid adapted from:
    // https://stackoverflow.com/questions/14208673/how-to-draw-grid-using-html5-and-canvas-or-svg
    return (<>
        <section 
            ref={container}
            class={`${sheet.active? "cursor-grabbing" : "cursor-auto"} ${local.class} overflow-y-hidden`} 
            onMouseMove={handleMouseMove} 
            onMouseUp={() => {placeActiveComponent(sheet, mousePosition())}}
            onMouseLeave={() => {placeActiveComponent(sheet, mousePosition())}}
        >
            <svg class="h-full w-full">

                <defs>
                    <pattern id="grid" width={sheet.gridSpacing} height={sheet.gridSpacing} patternUnits="userSpaceOnUse">
                        <path d={`M ${sheet.gridSpacing} 0 L 0 0 0 ${sheet.gridSpacing}`} fill="none" stroke="gray" stroke-width="0.5" />
                    </pattern>
                </defs>
                <rect class="dark:invert" width="100%" height="100%" fill="url(#grid)" />

                <Show when={sheet.active}>
                    <Symbol component={sheet.activeComponent} sheet={sheet} />
                </Show>

                <For each={sheet.components}>{(component) =>
                    <Symbol component={component} sheet={sheet} />
                }</For>

                <For each={sheet.nodes}>{(node) =>
                    <Show 
                        when={sheet.connections(node) > 2 || sheet.connections(node) == 1}
                    >
                        <circle 
                            cx="2.5" cy="2.5" r="2" 
                            transform={`
                                translate(${sheet.toPixels(node)[0] - 2.5} ${sheet.toPixels(node)[1] - 2.5})
                            `}

                            class="dark:invert"
                            style={`   
                                stroke: black; 
                                fill: ${sheet.connections(node) > 2? "black" : "white"};
                            `} 
                        />
                    </Show>
                }</For>

                <Show when={sheet.active && sheet.activeComponent instanceof Wire}><rect
                    class="dark:invert"
                    style={`
                        stroke: black; 
                        fill: none;
                    `}

                    width={sheet.gridSpacing/2}
                    height={sheet.gridSpacing/2}

                    transform={`
                        translate(
                            ${sheet.toPixels(sheet.toGrid(mousePosition()))[0] - sheet.gridSpacing/4}
                            ${sheet.toPixels(sheet.toGrid(mousePosition()))[1] - sheet.gridSpacing/4}
                        )
                    `}
                /></Show>
            </svg>
        </section>
    </>);
}