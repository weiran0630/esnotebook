import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import "./styles/MarkdownEditor.scss";

import { Cell } from "../state";
import { useActions } from "../hooks/useActions";

interface MarkdownEditorProps {
  cell: Cell;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ cell }) => {
  const { updateCell } = useActions(); // redux
  const [editMode, setEditMode] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /** an event listener listen to click event outside editor */
    const documentListener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        event.target &&
        editorRef.current.contains(event.target as Node)
      ) {
        return; // do nothing if user clicked inside editor
      }
      setEditMode(false);
    };
    document.addEventListener("click", documentListener, { capture: true });
    return () => {
      document.removeEventListener("click", documentListener, {
        capture: true,
      });
    };
  }, []);

  if (editMode) {
    return (
      <div className="text-editor" ref={editorRef}>
        <MDEditor
          value={cell.content}
          onChange={(value) => updateCell(cell.id, value || "")}
        />
      </div>
    );
  }

  return (
    <div className="text-editor card" onClick={() => setEditMode(true)}>
      <div className="card-content">
        <MDEditor.Markdown
          source={cell.content || "# Click to edit \n - markdown editor"}
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
