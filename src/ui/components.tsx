/**
 * Provides an interface for looking at components
 */

import { splitProps, For, Switch, Match, createSignal } from "solid-js";
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
        <section class="w-full h-full pd-4 overflow-y-scroll">
            <For each={sheet.components}>{(cpt) =>
                <article class="bg-primary text-primary shadow-md rounded-sm m-4 p-4">
                    <p>{cpt.name}{cpt.id}</p>
                    <Switch>
                        <Match when={edit()}>
                            <input class="w-full" onInput={(e) => {cpt.value = e.currentTarget.value}} value={cpt.value}></input>
                        </Match>
                        <Match when={!edit()}>
                            <Equation class="w-full">{cpt.value}</Equation>
                        </Match>
                    </Switch>
                </article>
            }</For>
            <button onClick={() => {setEdit(!edit())}}>Edit</button>
        </section>
    </>);
}