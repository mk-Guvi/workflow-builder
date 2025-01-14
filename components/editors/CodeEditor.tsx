import React, { useCallback, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap, EditorView } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import {
  completionKeymap,
  autocompletion,
  CompletionContext,
  CompletionResult
} from "@codemirror/autocomplete";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  className?: string;
  type?: "JS" | "JSON";
  nodes?: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}



const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};



const getLanguageExtension = (type: 'JS' | 'JSON') => {
  switch (type) {
    case 'JSON':
      return javascript({ jsx: false, typescript: false });
    case 'JS':
    default:
      return javascript({ jsx: true, typescript: true });
  }
};

const nodeCompletions = (nodes: string[] = []) => {
  return (context: CompletionContext): CompletionResult | null => {
    // Stage 1: Node name suggestions after $(
    const nodeMatch = context.matchBefore(/\$\(([^)]*$)/);
    if (nodeMatch) {
      const textAfterDollar = nodeMatch.text.slice(2);
      const hasQuote = textAfterDollar.includes("'") || textAfterDollar.includes('"');

      return {
        from: hasQuote ? nodeMatch.from + 3 : nodeMatch.from + 2,
        options: nodes.map(node => ({
          label: node,
          type: 'variable',
          apply: `'${node}'`
        }))
      };
    }

    // Stage 2: .item or .all suggestions
    const methodMatch = context.matchBefore(/\$\(['"]\w+['"]\)\.(\w*)$/);
    if (methodMatch) {
      const methods = [
        { label: 'item', info: 'Returns a single item' },
        { label: 'all', info: 'Returns all items as array' }
      ];

      return {
        from: methodMatch.text.lastIndexOf('.') + 1 + methodMatch.from,
        options: methods.map(method => ({
          label: method.label,
          type: 'property',
          info: method.info
        }))
      };
    }

    // Stage 3: .json suggestion after .item or .all
    const jsonMatch = context.matchBefore(/\$\(['"]\w+['"]\)\.(item|all)\.(\w*)$/);
    if (jsonMatch) {
      return {
        from: jsonMatch.text.lastIndexOf('.') + 1 + jsonMatch.from,
        options: [{
          label: 'json',
          type: 'method',
          info: 'Returns data as JSON'
        }]
      };
    }

    return null;
  };
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  className,
  type = 'JS',
  nodes = [],
  onChange,
  disabled = false,
}) => {
  const [isValidJSONValue, setIsValidJSONValue] = useState(type === 'JSON' ? isValidJSON(value) : true);

  const handleChange = useCallback((newValue: string,) => {
    if (type === 'JSON') {
      setIsValidJSONValue(isValidJSON(newValue));
    }
    onChange(newValue);
  }, [onChange, type]);

  const extensions = useMemo(() => [
    getLanguageExtension(type),
    keymap.of([...defaultKeymap, ...completionKeymap]),
    autocompletion({
      override: [nodeCompletions(nodes)]
    }),
    EditorView.lineWrapping,
    EditorView.theme({
      "&": {
        textAlign: "left",
        fontSize: "13px",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
      },
      ".cm-content": {
        fontFamily: "inherit",
        fontSize: "inherit"
      },
      ".cm-line": {
        fontFamily: "inherit",
        fontSize: "inherit"
      },
      ".cm-scroller": {
        fontFamily: "inherit",
        fontSize: "inherit"
      },
      ".cm-tooltip": {
        fontSize: "12px"
      },
      ".cm-completionLabel": {
        fontSize: "12px"
      }
    }),
    EditorView.editable.of(!disabled)
  ], [nodes, type, disabled]);

  return (
    <div className={cn('w-full space-y-2', className)}>
      <CodeMirror
        value={value}
        height="200px"
        extensions={extensions}
        onChange={handleChange}
        theme="light"
        editable={!disabled}
        style={{ textAlign: 'left' }}
        basicSetup={{
          lineNumbers: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightActiveLine: true,
          indentOnInput: true,
        }}
      />
      {type === 'JSON' && !isValidJSONValue && (
        <div className="text-sm text-red-500">
          Invalid JSON format
        </div>
      )}
    </div>
  );
};

export default CodeEditor;