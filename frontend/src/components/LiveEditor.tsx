"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "@/context/ContextProvider";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

interface ILiveEditorProps {
  editorData: string;
  sendEditorData: (data: string) => void;
}

const LiveEditor = ({ editorData, sendEditorData }: ILiveEditorProps) => {
  const context = useAppContext();

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const setUpdates = useCallback(
    (value: string) => {
      if (context) {
        context.setAppState((state) => ({
          ...state,
          content: value,
        }));

        sendEditorData(value);
      }
    },
    [context, sendEditorData]
  );

  const onChangeEditorContent = useCallback(
    (value: string) => {
      if (context) {
        setUpdates(value);
        setUndoStack((prev) => [...prev, value]);
        setRedoStack([]);
      }
    },
    [context, setUpdates]
  );

  useEffect(() => {
    if (editorData) {
      if (context) {
        context.setAppState((state) => ({
          ...state,
          content: editorData,
        }));
      }
    }
  }, [editorData, context]);

  const undo = () => {
    if (undoStack.length > 0 && context) {
      const content = undoStack.pop();
      setRedoStack((prev) => [...prev, content as string]);
      setUpdates(undoStack[undoStack.length - 1] || "");
    }
  };

  const redo = () => {
    if (redoStack.length > 0 && context) {
      const content = redoStack.pop();
      setUndoStack((prev) => [...prev, content as string]);
      setUpdates(content as string);
    }
  };

  if (!context) return null;

  return (
    <div>
      <div className="flex gap-2 m-2">
        <button
          disabled={!undoStack.length}
          className="disabled:opacity-50 cursor-pointer border-1 p-1 rounded-md"
          onClick={undo}
        >
          Undo
        </button>
        <button
          disabled={!redoStack.length}
          className="disabled:opacity-50 cursor-pointer border-1 p-1 rounded-md"
          onClick={redo}
        >
          Redo
        </button>
      </div>
      <ReactQuill
        modules={modules}
        theme="snow"
        value={context.appState.content}
        onChange={onChangeEditorContent}
      />
    </div>
  );
};

export default React.memo(LiveEditor);
