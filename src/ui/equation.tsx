/**
 * Handles loading LaTeX formatted expressions.
 */

import { children, onMount, splitProps } from "solid-js";

import katex from "katex";

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

    // element to render the LaTeX into
    let renderTarget;

    // render LaTeX into renderTarget once loaded
    onMount(() => {
        katex.render(c() as string, renderTarget);
    });

    return (<>
        <article class={local.class}>
            <p class={local.class} ref={renderTarget}></p>
        </article>
    </>);
}