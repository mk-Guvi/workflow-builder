import React, { useMemo } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

function NodeDataView({ data }: Props) {
  const formattedJson = useMemo(() => {
    try {
      return !data ? "" : JSON.parse(data);
    } catch {
      return data;
    }
  }, [data]);

  return (
    <div className="h-full w-full overflow-auto p-3">
      {formattedJson ? (
        <JsonView
          editable={false}
          className="text-xs"
          theme="vscode"
          src={formattedJson}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-sm text-gray-500">No data</div>
        </div>
      )}
    </div>
  );
}

export default NodeDataView;
