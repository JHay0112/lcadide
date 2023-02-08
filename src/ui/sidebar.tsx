/**
 * Defines a generic sidebar
 */

import { children, For, splitProps } from "solid-js";

/**
 * Editor sidebar
 */
export default function Sidebar(props) {

    let [local, _] = splitProps(props, ["class"]);
    // get component children
    const c = children(() => props.children);

    return (<>
        <aside class={local.class}>
            <For each={c.toArray()}>{(child, _) =>
                <article class={`dark h-full md:h-1/${c.toArray().length} w-full`}>
                    {child}
                </article>
            }</For>
        </aside>
    </>);
}