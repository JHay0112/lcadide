/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, Show } from "solid-js";

import Sheet from "../model/sheet";
import Component from "../model/components/component";

/**
 * SVG component symbols.
 */
export default function Symbol(props) {

    // get component object from props
    let [local, _] = splitProps(props, ["component", "sheet"]);
    let component: Component = local.component;
    let sheet: Sheet = local.sheet;

    let [displayContextMenu, setDisplayContextMenu] = createSignal(false);
    let [contextMenuPosition, setContextMenuPosition] = createSignal([0, 0]);

    return (<>
        <svg 
            height={component.pixelHeight} 
            width={component.pixelWidth}
            class={`${sheet.active? "cursor-grabbing" : "cursor-grab"} dark:invert`}
            style={`
                stroke: ${component.color}; 
                stroke-width: 1.5; 
                fill: none;
                position: absolute;
                top: ${sheet.toPixels(component.position)[1]}px;
                left: ${sheet.toPixels(component.position)[0]}px;
                rotate: ${90*component.orientation}deg;
            `}
            shape-rendering="auto"
            onContextMenu={(event) => {
                setContextMenuPosition([event.clientX, event.clientY]);
                setDisplayContextMenu(true);
                event.preventDefault();
            }}
            onClick={() => {
                if (!sheet.active) {
                    component.delete();
                    sheet.activeComponent = this;
                }
            }}
        >
            <path d={component.path()} />
        </svg>
        <Show when={displayContextMenu()}>
            <aside 
                class="bg-primary rounded-md p-3 drop-shadow-md text-left z-50" 
                style={`
                    position: absolute;
                    top: ${contextMenuPosition()[1] - 3}px;
                    left: ${contextMenuPosition()[0] - 3}px;
                `}
                onMouseLeave={() => {
                    setDisplayContextMenu(false);
                }}
            >
                <button class="w-full hover:opacity-80" onClick={() => {component.delete()}}>Delete</button>
                <button class="w-full hover:opacity-80" onClick={() => {component.rotate()}}>Rotate</button>
            </aside>
        </Show>
    </>);  
}