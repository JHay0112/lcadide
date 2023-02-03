/**
 * Emulates a graphical Python terminal
 */

import { createSignal, Resource, Show, splitProps, For } from "solid-js";
import { PyodideInterface } from "../../public/pyodide";

/**
 * Graphical Python terminal loader
 */
export default function Terminal(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["py"]);
    let py: Resource<PyodideInterface> = local.py;

    // setup terminal output and input
    let input;
    const [output, setOutput] = createSignal([]);

    return (<>
        <section class="dark w-full h-full font-mono p-1">
            <Show when={!py.loading} fallback={
                <p>Loading Pyodide Shell...</p>
            }>
                <p>Pyodide Shell</p>
                <section class="w-full" style="white-space: pre-wrap;">
                    <For each={output()}>{(line, _) => 
                        <p><span class="h-primary text-bold">&gt;&gt;&gt;</span> {line}</p>
                    }</For>
                </section>
                <form action="javascript:void(0)" onSubmit={() => {
                    switch(input.value) {
                        case "exit()":
                            break; // TODO: Collapse terminal?
                        case "clear()":
                            setOutput([]);
                            break;
                        default:
                            setOutput([...output(), input.value]);
                            py.latest.runPython(input.value);
                            let stdout = py.latest.runPython("sys.stdout.getvalue()");
                            if (stdout != "") {
                                setOutput([...output(), stdout]);
                            }
                    }
                    input.value = "";
                }}>
                    <label for={input} class="h-primary text-bold">&gt;&gt;&gt; </label>
                    <input type="text" ref={input} style="w-full" value="" />
                    <input type="submit" value="" />
                </form>
            </Show>
        </section>
    </>);
}