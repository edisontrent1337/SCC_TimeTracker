import { declareChildApplication, start } from "single-spa";
import SystemJS from "systemjs";
declareChildApplication(
    "home",
    () =>
        SystemJS.import("http://localhost:8080/dist/bundle.js").then(
            module => module.home
        ),
    () =>
        location.pathname === "" ||
        location.pathname === "/" ||
        location.pathname.startsWith(home)
);




/*declareChildApplication('home', () => scriptTagApp('http://localhost:8080/dist/bundle.js', 'MyReactApp'),     () =>
        location.pathname === "" ||
        location.pathname === "/" ||
        location.pathname.startsWith(home));*/
start();
/* This function is a very simplistic promise-based "module loader" that allows you to script tag a child application. It is an alternative to using a
 *  module loader like SystemJS that is pretty simple but not as fancy (since it depends on global variables).
 *  How it works is it wraps the process of script tagging a javascript file into a promise. Once the `<script>` tag has executed,
 *  it looks for a global variable that was created by the javascript code and hands that to single-spa as the child application.
 * What this means is that the child application itself will need to create the global variable.
 */


function scriptTagApp(url, globalVarName) {
  return new Promise((resolve, reject) => {
    const scriptEl = document.createElement('script');
    scriptEl.src = url;
    scriptEl.async = true;
    scriptEl.onload = () => resolve(window[globalVarName]);
    scriptEl.onerror = err => reject(err);
    document.head.appendChild(scriptEl);
  });
}
