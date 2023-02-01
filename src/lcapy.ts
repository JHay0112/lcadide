/**
 * This script uses pyodide to load lcapy from a custom wheel
 */

import {loadPyodide, PyodideInterface} from "pyodide";

/**
 * Custom Lcapy wheel
 * It has been created without the matplotlib requirement
 */
const LCAPY: string = "lib/lcapy-1.11-py3-none-any.whl";

/**
 * Load lcapy
 * This requires a manual loading of dependencies
 */
async function loadLcapy(): Promise<PyodideInterface> {

    let pyodide = await loadPyodide();

    await pyodide.loadPackage("micropip");

    await pyodide.runPythonAsync(`
from micropip import install
await install("networkx")
await install("IPython")
await install("property-cached")
await install("wheel")
    `);
    
    await pyodide.loadPackage("sympy");
    await pyodide.loadPackage("matplotlib");
    await pyodide.loadPackage("scipy");
    await pyodide.loadPackage("setuptools")

    await pyodide.loadPackage(LCAPY);

    await pyodide.runPython("from lcapy import Circuit");

    return pyodide;
}
