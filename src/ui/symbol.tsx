/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, Show, onMount, For } from "solid-js";

import Popup from "./popup";
import Equation from "./equation";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import Ground from "../model/components/ground";

/**
 * Defines the action a user can take on the component.
 */
interface Action {
    name: string;
    useable: () => boolean;
    callback: () => void;
};

/**
 * SVG component symbols.
 */
export default function Symbol(props) {

    // get component object from props
    const [local, _] = splitProps(props, ["component", "sheet"]);
    const component: Component = local.component;
    const sheet: Sheet = local.sheet;

    const [displayContextMenu, setDisplayContextMenu] = createSignal(false);

    // define actions to be implemented
    let actions = new Map<string, Action>();
    actions.set("r", {
        name: "Rotate",
        useable: () => {
            return !(component instanceof Ground);
        },
        callback: () => {
            component.rotate();
        }
    });
    actions.set("Delete", {
        name: "Delete",
        useable: () => {return true},
        callback: () => {
            sheet.delete(component);
        }
    });

    // register a keydown event
    // this handles keypresses that may manipulate the component
    onMount(() => {
        window.addEventListener("keydown", (event) => {
            if (component == sheet.activeComponent && sheet.active) {
                if (event.key == "Escape") {
                    sheet.placeActiveComponent();
                } else if (actions.has(event.key)) {
                    const action = actions.get(event.key);
                    if (action.useable()) {
                        action.callback();
                    }
                }
            }
        });
    });

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
                setDisplayContextMenu(true);
                event.preventDefault();
            }}
            onMouseDown={(event) => {
                if (!sheet.active && event.button == 0) { // button == 0 -> main button
                    sheet.delete(component);
                    sheet.activeComponent = component;
                }
            }}
        >
            <path d={component.path()} />
        </svg>
        <Show when={displayContextMenu()}>
            <Popup 
                title={`${component.name}${component.id}`} 
                onExit={() => {setDisplayContextMenu(false)}} 
                class="flex"
            >
                <article class="w-full md:w-3/4 md:inline-block flex flex-col m-auto">
                    <Equation class="p-4">{`
                        ${component.name}_{${component.id}}=${component.value}
                    `}</Equation>
                </article>
                <aside class="w-full md:w-1/4 md:inline-block bg-secondary text-secondary p-4 rounded-md flex flex-col m-auto">
                    <For each={Array.from(actions.entries())}>{([key, action]) =>
                        <button 
                            class={`w-full ${action.useable()? "hover:opacity-80" : "opacity-30"}`}
                            onClick={() => {
                                if (action.useable()) {
                                    action.callback();
                                }
                            }}
                        >
                            <span class={`float-left ${action.useable()? "" : "line-through"}`}>{action.name}</span>
                            <span class="float-right opacity-50">{key}</span>
                        </button>
                    }</For>
                </aside>
            </Popup>
        </Show>
    </>);  
}