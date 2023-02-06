/**
 * Handles editor toolbar
 */

import { splitProps } from "solid-js";

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
        <section class="text-secondary bg-secondary absolute inset-x-0 bottom-0 w-full md:w-2/3 text-center">
            <button class="px-4 py-2 transition-all hover:bg-primary hover:text-primary mx-2" onClick={() => {
                sheet.activeComponent = new Resistor()
            }}>R</button>
        </section>
    </>);
}