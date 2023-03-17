/**
 * Defines the context menu for symbols.
 */

import { createSignal, splitProps, Match, Switch, For, Show } from "solid-js";

import py from "../py/python";

import Component from "../model/components/component";
import Wire from "../model/components/wire";
import Ground from "../model/components/ground";
import Sheet from "../model/sheet";

import Popup from "./popup";
import ErrorBox from "./error";
import Equation from "./equation";

/**
 * Defines the action a user can take on the component.
 */
interface Action {
    name: string;
    useable: () => boolean;
    callback: () => void;
};

/**
 * Symbol context menu
 */
export default function ContextMenu(props) {

    // get component object from props
    const [local, _] = splitProps(props, ["component", "sheet", "when", "onExit"]);
    const component: Component | Wire = local.component;
    const sheet: Sheet = local.sheet;

    // track editing state of the component
    const [edit, setEdit] = createSignal(false);

    // track whether a value should be displayed
    const [displayValue, setDisplayValue] = createSignal(false);
    const [property, setProperty] = createSignal("");
    const [value, setValue] = createSignal("");

    // track whether an error should be displayed
    const [displayError, setDisplayError] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal("");

    // reference to value input box
    let valueInput;

    /**
     * Routine for inspecting a property of the component
     */
    function inspect(property: string) {
        setProperty(property);
        setDisplayValue(true);
        // generate netlist
        const netlist = sheet.forLcapy();
        // get output from lcapy
        py.latest.runPython("sys.stdout = io.StringIO()");
        try {
            // truly high quality coding style
            py.latest.runPython(`
cct = lcapy.Circuit('''${netlist}''')
output = lcapy.latex(cct.${component.name}${component.id}.${property})
            `);
            const output = py.latest.globals.get("output").toString();
            setValue(output);
        } catch(e) {
            setDisplayValue(false);
            if (e.type == "RuntimeError") {
                // occurs when circuit has no ground
                setErrorMessage("It appears your circuit may lack a ground node, please add one before analysing.");
            } else if (e.type == "ValueError") {
                // occurs when circuit is not fully complete
                setErrorMessage("It appears your circuit may not be complete, please connect all components before analysing.");
            } else {
                setErrorMessage(e.message);
            }
            setDisplayError(true);
        }
    }

    // define actions to be implemented
    const actions: Action[] = [
        {
            name: "Rotate",
            useable: () => {return !(component instanceof Wire)},
            callback: () => {
                if (!(component instanceof Wire)) {
                    component.rotate();
                }
            }
        }, {
            name: "Delete",
            useable: () => {return true},
            callback: () => {
                local.onExit();
                sheet.delete(component);
            }
        }, {
            name: "Edit",
            useable: () => {return !(component instanceof Wire || component instanceof Ground)},
            callback: () => {
                setDisplayValue(false);
                setEdit(true);
                valueInput.focus(); // focus on the input box
            }
        }, {
            name: "Inspect Voltage",
            useable: () => {return !(component instanceof Wire || component instanceof Ground)},
            callback: () => {inspect("v")}
        }, {
            name: "Inspect Current",
            useable: () => {return !(component instanceof Wire || component instanceof Ground)},
            callback: () => {inspect("i")}
        }
    ]


    return (<>
        <Popup 
            title={`${component.name}${component.id}`} 
            when={local.when}
            onExit={local.onExit} 
            class="flex h-full justify-center"
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

                    {/* Display the value selected by the user */}
                    <Match when={displayValue()}>
                        <Equation>{`${property()}_{\\text{${component.name}${component.id}}} = ${value()}`}</Equation>
                    </Match>

                    {/* Display the component value in latex when not editing */}
                    <Match when={!edit()}>
                        <Equation>{`
                            \\text{${component.name}${component.id}}=${component.value}\ \\left[${component.prefix} ${component.unit}\\right]
                        `}</Equation>
                    </Match>

                    {/* Give an edit box when editing. */}
                    <Match when={edit()}>
                        <Equation class="inline-block">{`\\text{${component.name}${component.id}}=`}</Equation>
                        <input 
                            ref={valueInput}
                            class="inline-block bg-primary text-primary" 
                            value={component.value}
                            onInput={(event) => {
                                component.value = event.currentTarget.value;
                            }}
                        ></input>
                        <Equation class="inline-block">{`\ \\left[${component.prefix} ${component.unit}\\right]`}</Equation>
                    </Match>
                </Switch>
            </form>

            {/* Sidebar, set of actions that can be applied to the component, and things that can be computed. */}
            <aside class="w-full md:w-1/4 md:inline-block bg-secondary text-secondary p-4 rounded-md flex flex-col m-auto">
                <For each={actions}>{(action) =>
                    <button 
                        class={`w-full text-left pb-1 first:pt-1 ${action.useable()? "hover:opacity-80" : "opacity-30 hover:cursor-default"}`}
                        onClick={() => {
                            if (action.useable()) {
                                action.callback();
                            }
                        }}
                    >
                        {action.name}
                    </button>
                }</For>
            </aside>

            {/* Error display for when errors occur */}
            <Show when={displayError()}>
                <ErrorBox onExit={() => {setDisplayError(false)}}>
                    {errorMessage()}
                </ErrorBox>
            </Show>
        </Popup>
    </>);
}