/* CilikLab Python Time Machine: actual Pyodide execution, isolated worker. */
let pyodidePromise = null;
const VERSION = 'v0.27.7';
const BASE = `https://cdn.jsdelivr.net/pyodide/${VERSION}/full/`;
const failMessage = (e) => (e && e.message) || String(e);
async function pythonReady() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      postMessage({type:'status', message:'Loading the Python runtime… (first use needs internet)'});
      importScripts(BASE + 'pyodide.js');
      const py = await loadPyodide({indexURL:BASE});
      const response = await fetch(new URL('tracer.py', self.location.href));
      if (!response.ok) throw new Error('Unable to load the CilikLab trace engine.');
      const helper = await response.text();
      py.runPython(helper);
      postMessage({type:'status', message:'Python is ready. Recording execution…'});
      return py;
    })().catch(err => {pyodidePromise=null; throw err;});
  }
  return pyodidePromise;
}
self.onmessage = async (event) => {
  const {id, code, type} = event.data || {};
  if (type !== 'run') return;
  try {
    const py = await pythonReady();
    py.globals.set('_ciko_source', String(code||''));
    postMessage({type:'status', message:'Python is ready. Tracing the program…'});
    const payload = py.runPython('_ciko_execute(_ciko_source)');
    postMessage({type:'result', id, data:JSON.parse(payload)});
  } catch (error) {
    postMessage({type:'error', id, message:failMessage(error)});
  }
};
