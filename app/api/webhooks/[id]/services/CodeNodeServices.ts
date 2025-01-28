import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import vm from "vm";
import { getCurrentUTC } from "@/lib/utils";

type RunJsScriptResult = {
  logs: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const sandbox = {
      console: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        log: (...args: any[]) => capturedLogs.push(args.join(" ")),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (...args: any[]) => capturedLogs.push(args.join(" ")),
      },
      Math,
      Date,
      Buffer,
      TextEncoder,
      TextDecoder,
      ...(options.allowUnsafe ? { process } : { require, fetch }),
    };

    const context = vm.createContext(sandbox);
    const script = new vm.Script(code);

    result.data = script.runInContext(context, {
      timeout: options.timeout,
      displayErrors: false,
    });
  } catch (error) {
    result.error = error instanceof Error ? error.message : "Unknown error";
  } finally {
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

// Example usage:
// const result = await runJsScript('console.log("Hello"); 42');
