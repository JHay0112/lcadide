import {Component, lazy, Suspense} from 'solid-js';
import loadPython from './py/lcapy';

const Canvas = lazy(async () => {
  let py = await loadPython();
  return import("./ui/canvas");
});

const App: Component = () => {

  return(
    <>
      <Suspense fallback={<p>loading...</p>}>
        <Canvas />
      </Suspense>
    </>
  );
};

export default App;
