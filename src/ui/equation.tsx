/**
 * Handles loading LaTeX formatted expressions.
 */

import { children, onMount } from "solid-js";

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

    // element to render the LaTeX into
    let renderTarget;

    // render LaTeX into renderTarget once loaded
    onMount(() => {
        katex.render(c() as string, renderTarget);
    });

    return (<>
        <article>
            <p ref={renderTarget}></p>
        </article>
    </>);
}