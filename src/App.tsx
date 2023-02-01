import {
  Component, 
  lazy, 
  Suspense, 
  createSignal
} from 'solid-js';

import loadPython from './py/lcapy';

/**
 * Lazy loading canvas,
 * this awaits lcapy loading before import the actual canvas
 */
const Canvas = lazy(async () => {
  let py = await loadPython();
  return import("./ui/canvas");
});

/**
 * Loading screen,
 * used as a fallback before canvas load
 */
const LoadingScreen = () => {

  // create a continually updating set of ellipse dots
  const [ellipses, setEllipses] = createSignal(".");
  setInterval(
    () => {
      if (ellipses().length >= 3) {
        setEllipses(".");
      } else {
        setEllipses(ellipses().concat("."));
      }
    }, 
    400 // 0.4s delay between dot updates
  );

  // TODO: get feedback from python loader to pass onto the user
  return (
    <>
      <section class="h-screen w-screen flex flex-col justify-center text-center">
        <h1>lcadide</h1>
        <p><br /></p>
        <p>loading dependencies</p>
        <p>{ellipses()}</p>
      </section>
    </>
  );
}

const App: Component = () => {
  return(
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Canvas />
      </Suspense>
    </>
  );
};

export default App;
