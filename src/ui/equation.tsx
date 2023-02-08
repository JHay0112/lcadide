/**
 * Handles loading LaTeX formatted expressions.
 */

import { children, createSignal, onMount, splitProps } from "solid-js";

import katex from "katex";
import { render } from "solid-js/web";

/**
 * Renders LaTeX expressions with KaTeX
 * 
 * ```tsx
 * <Equation>{"
 *   E = mc^{2}
 * "}</Equation>
 * ```
 */
export default function Equation(props) {

    // load in children of equation
    // this is the LaTeX formatted string
    const c = children(() => props.children);
    
    // bring in styling
    const [local, _] = splitProps(props, ["class"]);

    // track errors
    const [error, setError] = createSignal(false);

    // element to render the LaTeX into
    let renderTarget;

    // render LaTeX into renderTarget once loaded
    onMount(() => {
        try {
            katex.render(c() as string, renderTarget);
            setError(false);
        } catch(e) {
            renderTarget.innerHTML = "LaTeX Error!";
            setError(true);
        }
    });

    return (<>
        <article class={local.class}>
            <p class={`${error()? "text-error" : "text-primary"} ${local.class}`} ref={renderTarget}></p>
        </article>
    </>);
}