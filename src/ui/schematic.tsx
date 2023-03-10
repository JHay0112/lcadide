/**
 * Canvas for drawing schematics upon
 */

import { splitProps, For, Show, onMount, createSignal } from "solid-js";

import { Orientation, Position } from "../types";

import Sheet from "../model/sheet";

import Symbol from "./symbol";

import Wire from "../model/wire";
import Ground from "../model/components/ground";
import Resistor from "../model/components/resistor";
import Inductor from "../model/components/inductor";
import Capacitor from "../model/components/capacitor";
import VoltageSource from "../model/components/voltage_source";
import CurrentSource from "../model/components/current_source";

/**
 * Canvas that draws schematics from a sheet
 */
export default function Schematic(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet", "class"]);
    let sheet: Sheet = local.sheet;

    // tracks the position of a cursor
    let [cursorPosition, setCursorPosition] = createSignal([-255, -255] as Position);
    let [cursorActive, setCursorActive] = createSignal(false);

    // tracks what stage of wire placement the user is in
    let firstNodePlaced: boolean = false;

    // reference to container element
    let container;

    // do a resize onload
    onMount(() => {
        sheet.gridSpacing = Math.max(container.clientWidth / 80, 20);
    });

    // handles placing the active component
    function placeActiveComponent(event) {
        if (sheet.active) {
            if (sheet.activeComponent instanceof Wire) {
                if (!firstNodePlaced) {
                    sheet.activeComponent.end = sheet.toGrid([
                        event.clientX,
                        event.clientY
                    ]);
                    firstNodePlaced = true;
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
                    firstNodePlaced = false;
                    setCursorActive(false);
                }
            } else {
                sheet.placeActiveComponent();
                firstNodePlaced = false;
                setCursorActive(false);
            }
        }
    }

    // handles mouse movements
    function handleMouseMove(event) {
        if (sheet.active) {
            if (sheet.activeComponent instanceof Wire) {
                setCursorActive(true);
                if (firstNodePlaced) {
                    sheet.activeComponent.start = sheet.toGrid([
                        event.clientX,
                        event.clientY
                    ]);
                }
            } else {

                const middle = sheet.toPixels(sheet.activeComponent.middle);

                if (sheet.activeComponent.orientation == Orientation.HORIZONTAL) {
                    sheet.activeComponent.position = sheet.toGrid([
                        event.clientX - middle[1], 
                        event.clientY - middle[0]
                    ]);
                } else {
                    sheet.activeComponent.position = sheet.toGrid([
                        event.clientX - middle[0], 
                        event.clientY - middle[1]
                    ]);
                }
            }
        }

        // update cursor grip position
        // only when the cursor is active
        if (cursorActive() && sheet.active && sheet.activeComponent instanceof Wire) {
            setCursorPosition(sheet.toGrid([event.clientX, event.clientY]));
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
            onMouseUp={placeActiveComponent}
            onMouseLeave={placeActiveComponent}
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

                <Show when={cursorActive()}>
                    <rect
                        class="dark:invert"
                        style={`
                            stroke: black; 
                            fill: none;
                        `}

                        width={sheet.gridSpacing/2}
                        height={sheet.gridSpacing/2}

                        transform={`
                            translate(
                                ${sheet.toPixels(cursorPosition())[0] - sheet.gridSpacing/4}
                                ${sheet.toPixels(cursorPosition())[1] - sheet.gridSpacing/4}
                            )
                        `}
                    />
                </Show>
            </svg>
        </section>
    </>);
}