import {
    Component,
    lazy,
    Suspense,
    createSignal,
    createResource
} from 'solid-js';

import {Sheet} from './model/sheet';
import loadPython from './py/lcapy';

/**
 * Component sheet to be managged by editor
 */
let sheet = new Sheet();

/**
 * Python shell with lcapy
 */
const [py] = createResource(loadPython);

/**
 * Loading ellipses spinner
 */
const [ellipses, setEllipses] = createSignal(".");

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
    return import("./ui/Editor");
});

/**
 * Loading screen,
 * used as a fallback before editor load
 */
const LoadingScreen = () => {
    // TODO: get feedback from python loader to pass onto the user
    return (<>
        <section class="h-screen w-screen flex flex-col justify-center text-center bg-primary">
            <h1>lcadide</h1>
            <p><br /></p>
            <p>loading dependencies</p>
            <p>{ellipses()}</p>
        </section>
    </>);
}

const App: Component = () => {
    return (<>
        <Suspense fallback={<LoadingScreen />}>
            <Editor />
        </Suspense>
    </>);
};

export default App;
