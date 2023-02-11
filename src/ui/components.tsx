/**
 * Provides an interface for looking at components
 */

import { splitProps, For, createSignal, Show, Switch, Match } from "solid-js";
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
            <Show when={sheet.components.length > 0 || sheet.active} fallback={
                <p>Add components to edit...</p>
            }>

                <button class="w-full text-center" onClick={() => {setEdit(!edit())}}>Edit</button>

                <Show when={sheet.active}>
                    <article class="bg-secondary text-secondary shadow-md rounded-sm my-1 p-3">
                        <p>{sheet.activeComponent.name}{sheet.activeComponent.id}</p>
                        <Equation class="text-secondary inline-block">
                            <Show when={sheet.activeComponent.value != ""} fallback={0}>
                                {sheet.activeComponent.value}
                            </Show>
                        </Equation>
                        <Equation class="text-secondary float-right inline-block">
                            \left[{sheet.activeComponent.prefix} {sheet.activeComponent.unit}\right]
                        </Equation>
                    </article>
                </Show>

                <For each={sheet.components.reverse()}>{(cpt) =>
                    <article class="bg-primary text-primary shadow-md rounded-sm my-1 p-3">
                        <Switch>
                            <Match when={edit()}>
                                <label>{cpt.name}</label><input 
                                    class="bg-primary text-primary"
                                    onInput={(e) => cpt.id = e.currentTarget.value}
                                    value={cpt.id}
                                ></input>
                                <div>
                                    <input 
                                        class="bg-primary text-primary inline-block" 
                                        onInput={(e) => {cpt.value = e.currentTarget.value}} 
                                        value={cpt.value}
                                    ></input>
                                    <Equation class="inline-block float-right">\left[{cpt.prefix} {cpt.unit}\right]</Equation>
                                </div>
                            </Match>
                            <Match when={!edit()}>
                                <p>{cpt.name}{cpt.id}</p>
                                <Equation class="inline-block">
                                    <Show when={cpt.value != ""} fallback={0}>
                                        {cpt.value}
                                    </Show>
                                </Equation>
                                <Equation class="inline-block float-right">
                                    \left[{cpt.prefix} {cpt.unit}\right]
                                </Equation>
                            </Match>
                        </Switch>
                    </article>
                }</For>
            </Show>
            
        </section>
    </>);
}