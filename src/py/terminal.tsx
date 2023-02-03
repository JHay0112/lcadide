/**
 * Emulates a graphical Python terminal
 */

import { createSignal, Resource, Show, splitProps, For } from "solid-js";
import { PyodideInterface } from "pyodide";

/**
 * Graphical Python terminal loader
 * TODO: Give error outputs
 */
export default function Terminal(props) {

    // get python instance from props
    const [local, _] = splitProps(props, ["py"]);
    let py: Resource<PyodideInterface> = local.py;

    // setup terminal output and input
    let input;
    const [output, setOutput] = createSignal([]);

    return (<>
        <section class="w-full h-full font-mono text-primary bg-primary">
            <Show when={!py.loading} fallback={<p>Loading Pyodide Shell...</p>}>
                <section class="p-3" style="position: fixed; bottom: 0;">
                    <section class="w-full overflow-y-scroll z-0" style="white-space: pre-wrap;">
                        <For each={output()}>{(line, _) => 
                            <p>{line}</p>
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
                                setOutput([...output(), ">>> ".concat(input.value)]);
                                py.latest.runPython(input.value);
                                let stdout = py.latest.runPython("sys.stdout.getvalue()");
                                py.latest.runPython("sys.stdout = io.StringIO()");
                                if (stdout != "") {
                                    setOutput([...output(), stdout]);
                                }
                        }
                        input.value = "";
                    }}>
                        <label for={input} class="h-primary text-bold float-left">&gt;&gt;&gt;&nbsp;</label>
                        <input type="text" ref={input} class="bg-primary text-primary border-none float-left" value="" />
                        <input type="submit" value="" />
                    </form>
                </section>
            </Show>
        </section>
    </>);
}