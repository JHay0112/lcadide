/**
 * Emulates a graphical Python terminal
 */

import { createSignal, Show, For } from "solid-js";
import py from "./python";

/**
 * Graphical Python terminal loader
 * TODO: Give error outputs
 */
export default function Terminal() {

    // setup terminal output and input
    let input;
    let parent;
    const [output, setOutput] = createSignal([]);

    return (<>
        <Show when={!py.loading} fallback={<p>Loading Pyodide Shell...</p>}>
            <section class="w-full h-full dark">
                <article ref={parent} class="w-full h-full bg-primary text-primary p-3 overflow-y-scroll font-mono">
                    <header class="w-full whitespace-pre-wrap">
                        <p>Python (Pyodide 0.22.1) Shell</p>
                        <br />
                        <For each={output()}>{(line, _) => 
                            <p>{line}</p>
                        }</For>
                    </header>
                    <form action="javascript:void(0)" class="flex" onSubmit={() => {
                        switch(input.value) {
                            case "exit()":
                                break; // TODO: Collapse terminal?
                            case "clear()":
                                setOutput([]);
                                break;
                            default:
                                setOutput([...output(), ">>> ".concat(input.value)]);
                                py.latest.runPython("sys.stdout = io.StringIO()");
                                try {
                                    py.latest.runPython(input.value);
                                    let stdout = py.latest.runPython("sys.stdout.getvalue()");
                                    if (stdout != "") {
                                        setOutput([...output(), stdout]);
                                    }
                                } catch(e) {
                                    // catch and print python errors
                                    setOutput([...output(), e.message]);
                                } 
                        }
                        input.value = "";
                        parent.scrollTop = parent.scrollHeight;
                    }}>
                        <label for={input} class="h-primary text-bold float-left flex-none">&gt;&gt;&gt;&nbsp;</label>
                        <input type="text" ref={input} class="bg-primary text-primary float-left border-b-2 border-white border-solid outline-none flex-1" value="" />
                        <input type="submit" class="invisible" value="" />
                    </form>
                </article>
            </section>
        </Show>
    </>);
}