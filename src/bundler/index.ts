import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkgPathPlugin";
import { fetchPlugin } from "./plugins/fetchPlugin";

let service: esbuild.Service;

const Bundler = async (rawCode: string) => {
  /** initialize service if the service instance haven't been created */
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm", // get the web assembly file from unpkg
    });
  }

  /** build: actual bundling function */
  try {
    const result = await service.build({
      define: { "process.env.NODE_ENV": '"production"', global: "window" },
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      /**
       * intercept esbuild's build function with our custom plugin
       * unpkgPathPlugin() resolve the package path
       * fetchPlugin(inputCode: string) fetch the resolved path and load the package
       */
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    });

    return { code: result.outputFiles[0].text, error: "" };
  } catch (error) {
    return { code: "", error: error.message };
  }
};

export default Bundler;
