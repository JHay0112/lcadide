/**
 * Lcadide - Circuit Shematic Editor for Symbolic Circuit Simulations
 */

import { Component, lazy, Suspense, createSignal, onMount } from 'solid-js';

import py from './py/python';
import Sheet from './model/sheet';
import Popup from './ui/popup';

/**
 * Loading ellipses spinner
 */
const [ellipses, setEllipses] = createSignal(".");

/**
 * Editor sheet
 */
let sheet = new Sheet();

/**
 * Lazy loading editor,
 * this awaits lcapy loading before import the actual editor.
 * It also handles the updating of the ellipsis spinner
 */
const Editor = lazy(async () => {
    while (py.loading) {
        // check every 0.2 s
        await new Promise(r => setTimeout(r, 200));
        // update ellipses spinner
        if (ellipses().length >= 3) {
            setEllipses(".");
        } else {
            setEllipses(ellipses().concat("."));
        }
    }
    console.log("Editor loaded");
    return import("./ui/editor");
});

/**
 * Loading screen,
 * used as a fallback before editor load
 */
const LoadingScreen = () => {
    // TODO: get feedback from python loader to pass onto the user
    return (<>
        <section class="h-screen w-screen flex flex-col justify-center text-center bg-primary">
            <h1 class="h-primary font-bold text-lg">lcadide</h1>
            <p><br /></p>
            <p>loading dependencies</p>
            <p>{ellipses()}</p>
            <p><br /></p>
            <p><br /></p>
        </section>
    </>);
}

/**
 * Welcome popup,
 * used to update users on the state of Lcadide.
 * TODO: Only show to new users or when updated.
 */
const WelcomePopup = () => {

    const [showGreeting, setShowGreeting] = createSignal(false);

    onMount(async () => {
        await new Promise(r => setTimeout(r, 1500));
        setShowGreeting(true);
    });

    return(<>
        <Popup title="Kia ora!" when={showGreeting()} onExit={() => {setShowGreeting(false)}} class="p-2 text-justify">
            <p>
                Lcadide is a browser-based circuit design tool that uses the symbolic circuit analysis tool 
                <a href="https://github.com/mph-/lcapy" target="_blank">Lcapy</a> for simulation.
                This means that circuits built with Lcadide and simulated with Lcapy give exact equations for the voltage and
                current across components, much like a human can.
            </p>
            <br />
            <p>
                Please note that Lcadide may take some time (~1 minute) to load. This is because it is bringing in external 
                Python dependencies (including <a href="https://github.com/mph-/lcapy" target="_blank">Lcapy</a>) to run in your
                browser. For those curious about how this is achieved, and how Python tools are run in your browser, please visit 
                <a href="https://github.com/pyodide/pyodide" target="_blank">Pyodide</a>.
            </p>
            <br />
            <p>
                Lcadide is currently in early development. This means you will often run into bugs and incomplete features.
                If you wish to report these (please do, it helps us find and fix them) please visit the 
                <a href="https://github.com/JHay0112/lcadide/issues" target="_blank">issue and feature tracker</a>. 
                We are also open to feature requests and new ideas, these should be submitted through 
                <a href="https://github.com/JHay0112/lcadide/issues" target="_blank">issue and feature tracker</a> too.
            </p>
            <br />
            <p>
                For those of you keen to contribute to Lcadide, please visit the 
                <a href="https://github.com/JHay0112/lcadide" target="_blank">Github repository</a>.
                We also have an experimental dark theme, click <a href="javascript:toggleTheme()">here</a> to enable it.
            </p>
        </Popup>
    </>);
}

const App: Component = () => {

    return (<>
        <Suspense fallback={<LoadingScreen />}>
            <Editor sheet={sheet} />
        </Suspense>
        <WelcomePopup />
    </>);
};

export default App;
