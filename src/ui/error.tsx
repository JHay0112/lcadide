/**
 * Creates error dialogues
 */

import { children, splitProps } from "solid-js";

/**
 * Pop-up error that shows near the bottom of the page.
 */
export default function ErrorBox(props) {
    // get children
    const c = children(() => props.children);

    const [local, _] = splitProps(props, ["onExit"]);
    const onExit: () => void = local.onExit;

    return (<> 
        <aside class="absolute left-0 right-0 bottom-20 bg-error z-50 text-secondary p-4 rounded-md m-auto w-10/12 md:w-8/12">
            <p class="float-left">Error:&nbsp;</p><p class="float-left break-words w-9/10">{c()}</p>
            <button 
                class="float-right inline-block p-1 font-mono align-middle" 
                onClick={() => {onExit()}}
            >
                <svg 
                    width="18" height="18"
                    class="stroke-secondary hover:opacity-50"
                >
                    <path d="
                        M 0, 0
                        L 18, 18
                        M 0, 18
                        L 18, 0
                    "></path>
                </svg>
            </button>
        </aside>
    </>);
}