/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import vm from "vm";
import { getCurrentUTC } from "@/lib/utils";
import moment from "moment-timezone";
import axios from "axios";

type RunJsScriptResult = {
  logs: string[];
  data: any;
  error?: string;
  executionTime?: Date;
};

type RunJsScriptOptions = {
  timeout?: number;
  allowUnsafe?: boolean;
};

// Worker thread implementation
if (!isMainThread) {
  const { code, options } = workerData;
  const capturedLogs: string[] = [];
  const result: Partial<RunJsScriptResult> = { logs: capturedLogs };

  try {
    // Create a mock require function for allowed modules
    const mockRequire = (moduleName: string) => {
      const allowedModules: Record<string, any> = {
        'moment-timezone': moment,
        'moment': moment,
        'axios': axios
      };
      
      if (moduleName in allowedModules) {
        return allowedModules[moduleName];
      }
      throw new Error(`Module '${moduleName}' is not allowed`);
    };

    const sandbox = {
      console: {
        log: (...args: any[]) => capturedLogs.push(args.join(" ")),
        error: (...args: any[]) => capturedLogs.push(args.join(" ")),
      },
      Math,
      Date,
      Buffer,
      TextEncoder,
      TextDecoder,
      moment,
      axios,
      require: mockRequire,
      Promise,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
    };

    const context = vm.createContext(sandbox);

    // Wrap the code in an async function to allow await operations
    const wrappedCode = `
      (async function() {
        try {
          ${code}
        } catch (error) {
          console.error(error);
          throw error;
        }
      })();
    `;

    const script = new vm.Script(wrappedCode);

    // Run the script and handle async operations
    Promise.resolve(script.runInContext(context, {
      timeout: options.timeout,
      displayErrors: true,
    }))
    .then(scriptResult => {
      // Ensure data is always an object
      result.data = typeof scriptResult === "object" && scriptResult !== null ? scriptResult : {};
      parentPort?.postMessage(result);
    })
    .catch(error => {
      result.error = error instanceof Error ? error.message : "Unknown error";
      parentPort?.postMessage(result);
    });

  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";
    parentPort?.postMessage(result);
  }
}

// Main thread implementation
export async function runJsScript(
  codeString: string,
  options: RunJsScriptOptions = {}
): Promise<RunJsScriptResult> {
  const { timeout = 100000 } = options;
  const executionTime = getCurrentUTC();

  return new Promise((resolve) => {
    const worker = new Worker(__filename, {
      workerData: { code: codeString, options },
    });

    const timeoutId = setTimeout(() => {
      worker.terminate();
      resolve({
        logs: [],
        data: null,
        error: "Execution timed out",
        executionTime,
      });
    }, timeout);

    worker.on("message", (message: Partial<RunJsScriptResult>) => {
      clearTimeout(timeoutId);
      resolve({
        logs: message.logs || [],
        data: message.data,
        error: message.error,
        executionTime,
      });
    });

    worker.on("error", (error) => {
      clearTimeout(timeoutId);
      resolve({
        logs: [],
        data: null,
        error: error.message,
        executionTime,
      });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        clearTimeout(timeoutId);
        resolve({
          logs: [],
          data: null,
          error: "Worker thread exited unexpectedly",
          executionTime,
        });
      }
    });
  });
}