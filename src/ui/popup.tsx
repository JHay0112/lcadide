/**
 * Creates pop-up dialogues
 */

import { children, onMount, splitProps, onCleanup } from "solid-js";

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
    const [local, _] = splitProps(props, ["title", "onExit", "class", "ref"]);
    const title: string = local.title;
    const onExit: () => void = local.onExit;
    const cls: string = local.class;
    const ref = local.ref;

    // stop scrolling
    onMount(() => {
        document.body.style.overflow = "hidden";
    });

    // re-enable scrolling
    onCleanup(() => {
        document.body.style.overflow = "auto";
    });

    return (<>
        <div ref={ref} class="absolute top-0 left-0 w-screen h-screen bg-opacity-70 bg-neutral-900 z-50 flex items-center justify-center">
            <article class="w-10/12 max-h-[90%] md:w-8/12 bg-primary p-4 rounded-md overflow-y-scroll">
                <header class="mb-3">
                    <h1 class="inline-block p-2">{title}</h1>
                    <button 
                        class="float-right inline-block p-2 font-mono align-middle" 
                        onClick={() => {onExit()}}
                    >
                        <svg 
                            width="18" height="18"
                            class="stroke-[#252525] dark:invert hover:opacity-50"
                        >
                            <path d="
                                M 0, 0
                                L 18, 18
                                M 0, 18
                                L 18, 0
                            "></path>
                        </svg>
                    </button>
                    <hr class="w-full" />
                </header>
                <article class={`${cls} overflow-y-scroll max-h-full`}>
                    {c()}
                </article>
            </article>
        </div>
    </>);
}