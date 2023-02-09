/**
 * Handles editor toolbar
 */

import { splitProps } from "solid-js";

import Sheet from "../model/sheet";

import Resistor from "../model/components/resistor";
import Capacitor from "../model/components/capacitor";

/**
 * Bottom toolbar for editor interface
 */
export default function Toolbar(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet", "class"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <section class={`text-secondary bg-secondary absolute inset-x-0 bottom-0 text-center transition-all ${local.class}`}>
            <button class="px-4 py-2 transition-all hover:bg-primary hover:text-primary mx-2" onClick={() => {
                sheet.activeComponent = new Resistor(sheet)
            }}>R</button>
            <button class="px-4 py-2 transition-all hover:bg-primary hover:text-primary mx-2" onClick={() => {
                sheet.activeComponent = new Capacitor(sheet)
            }}>C</button>
        </section>
    </>);
}