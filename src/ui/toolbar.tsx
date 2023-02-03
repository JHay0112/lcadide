/**
 * Handles editor toolbar
 */

import { Resource, splitProps } from "solid-js";

import Sheet from "../model/sheet";
import Resistor from "../model/cpts/resistor";

/**
 * Bottom toolbar for editor interface
 */
export default function Toolbar(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <section class="text-secondary bg-secondary absolute inset-x-0 bottom-0 w-full md:w-2/3">
            <button class="p-3 transition-all hover:bg-primary hover:text-primary" onClick={() => {
                sheet.addComponent(new Resistor())
            }}>R</button>
        </section>
    </>);
}