/**
 * Creates pop-up dialogues
 */

import { children, createSignal, splitProps, Show } from "solid-js";

/**
 * Dialogue that covers the entire page.
 * 
 * @param title: string 
 *  The title of the popup
 * @param when: boolean 
 *  Whether the popup should be displayed
 */
export default function Popup(props) {
    // get children
    const c = children(() => props.children);
    // get title
    const [local, _] = splitProps(props, ["title", "when"]);
    const title: string = local.title;
    const when: boolean = local.when;
    // track visibility
    let [visibile, setVisible] = createSignal(true);

    return (<>
        <Show when={visibile() && when}>
            <div class="absolute w-screen h-screen bg-opacity-70 bg-neutral-800 z-50 flex items-center justify-center">
                <div class="w-10/12 h-10/12 md:w-8/12 bg-primary relative bottom-10 p-4 rounded-md">
                    <header class="mb-3">
                        <h1 class="inline-block p-2">{title}</h1>
                        <button class="float-right inline-block text-mono p-2" onClick={() => {setVisible(false)}}>X</button>
                        <hr class="w-full" />
                    </header>
                    <article class="p-2">
                        {c()}
                    </article>
                </div>
            </div>
        </Show>
    </>);
}