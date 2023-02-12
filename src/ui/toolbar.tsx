/**
 * Handles editor toolbar
 */

import { children, splitProps } from "solid-js";

import Sheet from "../model/sheet";

import Resistor from "../model/components/resistor";
import Inductor from "../model/components/inductor";
import Capacitor from "../model/components/capacitor";
import VoltageSource from "../model/components/voltage_source";
import CurrentSource from "../model/components/current_source";
import Ground from "../model/components/ground";

/**
 * Icon/button for a tool
 */
function Tool(props) {

    // get onclick function
    const [local, _] = splitProps(props, ["onClick"]);
    const onClick = local.onClick;
    // get text
    const c = children(() => props.children);

    return (<>
        <button class="
            px-4 py-2 transition-all hover:bg-primary hover:text-primary mx-2
        " onClick={onClick}>{
            c()
        }</button>
    </>);
}

/**
 * Bottom toolbar for editor interface
 */
export default function Toolbar(props) {

    // get sheet instance from props
    const [local, _] = splitProps(props, ["sheet", "class"]);
    let sheet: Sheet = local.sheet;

    return (<>
        <section class={`text-secondary bg-secondary absolute inset-x-0 bottom-0 text-center transition-all ${local.class}`}>
            <Tool onClick={() => {
                sheet.activeComponent = new Resistor(sheet);
            }}>R</Tool>
            <Tool onClick={() => {
                sheet.activeComponent = new Inductor(sheet);
            }}>L</Tool>
            <Tool onClick={() => {
                sheet.activeComponent = new Capacitor(sheet);
            }}>C</Tool>
            <Tool onClick={() => {
                sheet.activeComponent = new VoltageSource(sheet);
            }}>V</Tool>
            <Tool onClick={() => {
                sheet.activeComponent = new CurrentSource(sheet);
            }}>I</Tool>
            <Tool onClick={() => {
                sheet.activeComponent = new Ground(sheet);
            }}>G</Tool>
        </section>
    </>);
}