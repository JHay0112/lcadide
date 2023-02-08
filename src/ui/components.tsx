/**
 * Provides an interface for looking at components
 */

import { splitProps, For, Show } from "solid-js";
import Sheet from "../model/sheet";
import Equation from "./equation";

/**
 * Lists components from a sheet,
 * providing an interface for editing them
 */
export default function Components(props) {

    let [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <section class="w-full h-full pd-4 overflow-y-scroll">
            <For each={sheet.components}>{(cpt) =>
                <article class="bg-primary text-primary shadow-md rounded-sm m-4 p-4">
                    <h2 class="h-primary">{cpt.name}{cpt.id}</h2>
                    <Equation class="w-full">{cpt.value}</Equation>
                </article>
            }</For>
        </section>
    </>);
}