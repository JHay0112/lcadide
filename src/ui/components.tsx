/**
 * Provides an interface for looking at components
 */

import { splitProps, For, createSignal, Show } from "solid-js";
import Sheet from "../model/sheet";
import Equation from "./equation";

/**
 * Lists components from a sheet,
 * providing an interface for editing them
 */
export default function Components(props) {

    let [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    const [edit, setEdit] = createSignal(false);

    return (<>
        <section class="w-full h-full p-3 overflow-y-scroll">
            <Show when={sheet.components.length > 0} fallback={
                <p>Add components to edit...</p>
            }>
                <button class="w-full text-center" onClick={() => {setEdit(!edit())}}>Edit</button>
                <For each={sheet.components}>{(cpt) =>
                    <article class="bg-primary text-primary shadow-md rounded-sm my-1 p-3">
                        <p>{cpt.name}{cpt.id}</p>
                        <Show when={edit()} fallback={
                            <input class="w-full bg-primary" onInput={(e) => {cpt.value = e.currentTarget.value}} value={cpt.value}></input>
                        }>
                            <Equation class="w-full">{cpt.value}</Equation>
                        </Show>
                    </article>
                }</For>
            </Show>
            
        </section>
    </>);
}