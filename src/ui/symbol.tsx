/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, onMount, For, Switch, Match, Show } from "solid-js";

import Popup from "./popup";
import Equation from "./equation";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import Ground from "../model/components/ground";
import Wire from "../model/components/wire";

/**
 * Defines the action a user can take on the component.
 */
interface Action {
    name: string;
    key: string;
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
    const [edit, setEdit] = createSignal(false);

    // define actions to be implemented
    const actions: Action[] = [
        {
            name: "Rotate",
            key: "r",
            useable: () => {return true},
            callback: () => {
                component.rotate();
            }
        },
        {
            name: "Delete",
            key: "Delete",
            useable: () => {return true},
            callback: () => {
                sheet.delete(component);
            }
        },
        {
            name: "Edit",
            key: "",
            useable: () => {return !(component instanceof Ground || component instanceof Wire) && !edit()},
            callback: () => {setEdit(true)}
        },
        {
            name: "Save",
            key: "",
            useable: () => {return !edit()},
            callback: () => {setEdit(false)}
        }
    ]
    // maps actions to keys
    let keybinds: Map<string, number> = new Map();
    actions.forEach((action, i) => {
        if (
            action.key != "" || 
            action.key !== undefined || 
            action.key !== null
        ) {
            keybinds.set(action.key, i);
        }
    });

    // reference to value input box
    let valueInput;

    // register a keydown event
    // this handles keypresses that may manipulate the component
    onMount(() => {
        window.addEventListener("keydown", (event) => {
            if (component == sheet.activeComponent && sheet.active) {
                if (event.key == "Escape") {
                    sheet.placeActiveComponent();
                } else if (keybinds.has(event.key)) {
                    const action = actions[keybinds.get(event.key)];
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
                rotate: ${-90*component.orientation}deg;
                transform-origin: center;
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
                <article 
                    class="w-full p-4 md:w-3/4 md:inline-block flex flex-col m-auto"
                    onClick={() => {
                        setEdit(true);
                        valueInput.focus();
                    }}
                    onKeyDown={(event) => {
                        if (event.key == "Enter") {
                            setEdit(false);
                        }
                    }}
                >
                    <Switch>
                        <Match when={component instanceof Ground || component instanceof Wire}>
                            <p>Ground nodes have no value...</p>
                        </Match>
                        <Match when={!edit()}>
                            <Equation>{`
                                ${component.name}_{${component.id}}=${component.value}\ \\left[${component.prefix} ${component.unit}\\right]
                            `}</Equation>
                        </Match>
                        <Match when={edit()}>
                            <Equation class="inline-block">{`${component.name}_{${component.id}}=`}</Equation>
                            <input 
                                ref={valueInput}
                                class="inline-block" 
                                value={component.value}
                                onInput={(event) => {
                                    component.value = event.currentTarget.value;
                                }}
                            ></input>
                            <Equation class="inline-block">{`\ \\left[${component.prefix} ${component.unit}\\right]`}</Equation>
                        </Match>
                    </Switch>
                </article>
                <aside class="w-full md:w-1/4 md:inline-block bg-secondary text-secondary p-4 rounded-md flex flex-col m-auto">
                    <For each={actions}>{(action) =>
                        <button 
                            class={`w-full ${action.useable()? "hover:opacity-80" : "opacity-30 hover:cursor-default"}`}
                            onClick={() => {
                                if (action.useable()) {
                                    action.callback();
                                }
                            }}
                        >
                            <span class="float-left">{action.name}</span>
                            <span class="float-right opacity-50">{action.key}</span>
                        </button>
                    }</For>
                </aside>
            </Popup>
        </Show>
    </>);  
}