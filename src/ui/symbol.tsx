/**
 * Produces component symbols for components.
 */

import { splitProps, createSignal, onMount, For, Switch, Match } from "solid-js";

import Popup from "./popup";
import Equation from "./equation";

import py from "../py/python";

import Sheet from "../model/sheet";
import Component from "../model/components/component";
import Ground from "../model/components/ground";
import Wire from "../model/wire";

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
    const component: Component | Wire = local.component;
    const sheet: Sheet = local.sheet;

    // track editing state of the circuit
    const [edit, setEdit] = createSignal(false);

    // define actions to be implemented
    const actions: Action[] = [
        {
            name: "Rotate",
            key: "r",
            useable: () => {return !(component instanceof Wire)},
            callback: () => {
                if (!(component instanceof Wire)) {
                    component.rotate();
                }
            }
        },
        {
            name: "Delete",
            key: "Delete",
            useable: () => {return true},
            callback: () => {
                sheet.delete(component);
            }
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

    // define the context menu
    let contextMenuRef;
    const contextMenu = (<>
        <Popup 
            ref={contextMenuRef}
            title={`${component.name}${component.id}`} 
            onExit={() => {document.body.removeChild(contextMenuRef)}} 
        >
            <form 
                class="w-full h-full p-4 md:w-3/4 md:inline-block flex flex-col m-auto"
                onSubmit={(event) => {
                    setEdit(false);
                    event.preventDefault();
                }} 
                onClick={() => {
                    if (!(component instanceof Ground || component instanceof Wire)) {
                        setEdit(true);
                        valueInput.focus(); // focus on the input box
                    }
                }}
            >
                <Switch>

                    {/* Grounds and wires are degenerate cases, they have no values */}
                    <Match when={component instanceof Ground}>
                        <p>Ground nodes have no value...</p>
                    </Match>
                    <Match when={component instanceof Wire}>
                        <p>Wires have no value...</p>
                    </Match>

                    {/* Display the component value in latex when not editing */}
                    <Match when={!edit()}>
                        <Equation>{`
                            ${component.name}_{${component.id}}=${component.value}\ \\left[${component.prefix} ${component.unit}\\right]
                        `}</Equation>
                    </Match>

                    {/* Give an edit box when editing. */}
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
            </form>

            {/* Sidebar, this gives actions that can be applied to the component. */}
            <aside class="w-full md:w-1/4 md:inline-block bg-secondary text-secondary p-4 rounded-t-md flex flex-col m-auto">
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

            {/* Bottom buttons, these give values that can be determined about the component. */}
            <aside class="w-full bg-secondary text-secondary p-4 flex-none rounded-b-md rounded-tl-md">
                {/* Determine the voltage across the component.*/}
                <button
                    onClick={() => {
                        // generate netlist
                        const netlist = sheet.forLcapy();
                        console.log(netlist);
                        // get output from lcapy
                        py.latest.runPython("sys.stdout = io.StringIO()");
                        try {
                            py.latest.runPython(`
cct = lcapy.Circuit('''${netlist}''')
print(lcapy.latex(cct.${component.name}${component.id}.V))
                            `);
                            const stdout = py.latest.runPython("sys.stdout.getvalue()");
                            console.log(stdout);
                        } catch(e) {
                            console.log(e.message);
                        }
                    }}
                >Voltage</button>
            </aside>
        </Popup>
    </>);

    // register a keydown event
    // this handles keypresses that may manipulate the component
    onMount(() => {
        window.addEventListener("keydown", (event) => {
            if (component == sheet.activeComponent && sheet.active) {
                if (event.key == "Escape") {
                    sheet.active = false;
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
        <g
            class={`${sheet.active? "cursor-grabbing" : "cursor-grab"} dark:invert`}
            shape-rendering="auto"

            transform={`
                translate(${sheet.toPixels(component.position)[0]} ${sheet.toPixels(component.position)[1]})
                rotate(${-90*component.orientation} ${sheet.toPixels(component.middle)[0]} ${sheet.toPixels(component.middle)[1]})
            `}
        >
            <path 
                style={`
                    stroke: ${component.color}; 
                    fill: none;
                    stroke-width: 1.5; 
                `}

                d={component.path()}
            />
            <path 
                style={`
                    stroke: rgba(0, 0, 0, 0);
                    fill: none;
                    stroke-width: 10; 
                `}

                d={component.path()} 

                onContextMenu={(event) => {
                    document.body.appendChild(contextMenuRef);
                    event.preventDefault();
                }}
                onMouseDown={(event) => {
                    if (!sheet.active && event.button == 0) { // button == 0 -> main button
                        sheet.delete(component);
                        sheet.activeComponent = component;
                    }
                }}  
            />
        </g>
    </>);  
}  