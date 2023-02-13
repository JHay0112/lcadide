/**
 * Creates pop-up dialogues
 */

import { children, createSignal, splitProps, Show } from "solid-js";

/**
 * Dialogue that covers the entire page.
 * 
 * @param title: string 
 *  The title of the popup
 * @param onExit: () => void
 *  Callback when the exit button is pressed.
 */
export default function Popup(props) {
    // get children
    const c = children(() => props.children);
    // get title
    const [local, _] = splitProps(props, ["title", "onExit", "class"]);
    const title: string = local.title;
    const onExit: () => void = local.onExit;
    const cls: string = local.class;

    return (<>
        <div class="absolute top-0 left-0 w-screen h-screen bg-opacity-90 bg-neutral-900 z-50 flex items-center justify-center">
            <div class="w-10/12 h-10/12 md:w-8/12 bg-primary relative bottom-10 p-4 rounded-md">
                <header class="mb-3">
                    <h1 class="inline-block p-2">{title}</h1>
                    <button 
                        class="float-right inline-block p-2 font-mono align-middle" 
                        onClick={() => {onExit()}}
                    >X</button>
                    <hr class="w-full" />
                </header>
                <article class={cls}>
                    {c()}
                </article>
            </div>
        </div>
    </>);
}