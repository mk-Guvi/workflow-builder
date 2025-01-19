import { EditorView } from "@codemirror/view";

export const baseTheme = EditorView.theme({
  "&": {
    padding: "0px",
    fontSize: "13px",
    lineHeight: "2",
    width: "100%",
    fontFamily: "inherit",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    color: "#4B5563 !important",
  },
  ".cm-scroller::-webkit-scrollbar": {
    display: "none",
  },
  ".cm-scroller": {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  ".cm-content": {
    textAlign: "left",
    padding: "0 0 0 6px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  ".cm-line": {
    padding: "0",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#3b82f6 !important",
    opacity: "0.1",
  },
  ".cm-selectionMatch": {
    backgroundColor: "transparent !important",
  },
  ".cm-selection": {
    color: "inherit !important",
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    color: "inherit !important",
    backgroundColor: "transparent !important",
  },

  ".cm-tooltip": {
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(48, 49, 51, 0.1)",
    zIndex: "9999",
    width: "fit-content",
    maxWidth: "10rem",
    overflow: "hidden",
  },
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "inherit",
      width: "fit-content",
      minWidth: "100%",
      maxHeight: "300px",
      padding: "4px",
      borderRadius: "14px",
      margin: "0",
      "& > li": {
        padding: "8px 12px",
        cursor: "pointer",
        lineHeight: "1.4",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&[aria-selected]": {
          backgroundColor: "#EEE0FF",
          borderRadius: "4px",
        },
      },
    },
  },
  ".cm-completionLabel": {
    color: "#1f2937",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  ".cm-completionDetail": {
    color: "#6b7280",
    fontSize: "11px",
    marginLeft: "8px",
  },
  ".cm-activeLine": {
    backgroundColor: "#EEE0FF",
    marginLeft: "-6px",
    paddingLeft: "6px",
  },
  ".cm-activeLine .cm-gutter": {
    backgroundColor: "#EEE0FF",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    color: "#6b7280",
    paddingLeft: "8px",
  },
  ".cm-editor": {
    height: "100%",
  },
  ".cm-gutter": {
    backgroundColor: "white",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#EEE0FF",
  },
  ".cm-completionIcon.cm-completionIcon-variable": {
    display: "none !important",
  },
  ".cm-completionIcon.cm-completionIcon-method": {
    display: "none !important",
  },
  ".cm-completionIcon.cm-completionIcon-property": {
    display: "none !important",
  },
  ".cm-tooltip-autocomplete": {
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
});

export const highlightTheme = EditorView.theme({
  ".cm-content .cm-variableName2": {
    color: "#4f46e5 !important",
    backgroundColor: "transparent !important",
    borderRadius: "2px",
    padding: "0",
  },
});
