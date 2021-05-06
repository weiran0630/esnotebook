import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage"; // package for using localDB

/**
 * * create a localDB instance
 */
const pkgCache = localForage.createInstance({
  name: "pkgcache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      /**
       * * onLoad callbacks run for each unique path and actually fetch it
       */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        /**
         * Check to see if we have already fetched this file
         * and if it is in the cache
         * if so, return it immediately
         */
        const cachedResult = await pkgCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });
      /** otherwise fetch and store the response in cache */

      /**
       * * Handle root entry file of "index.js"
       */
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      /**
       * * Handle CSS files
       */
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path); // fetch css
        /** convert all escape character to valid JS string character */
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        /**
         * trick esbuild to generate a style tag with imported css
         * and append it to the head of the document
         */
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;
        const unCachedResult: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          /**
           * @param resolveDir
           * previous resolved directory
           * for example: "/nested-test-pkg@1.0.0/src"
           */
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await pkgCache.setItem(args.path, unCachedResult);
        return unCachedResult;
      });

      /**
       * * Handle javascript file beside index.js
       */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path); // fetch js
        const unCachedResult: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await pkgCache.setItem(args.path, unCachedResult);
        return unCachedResult;
      });
    },
  };
};
