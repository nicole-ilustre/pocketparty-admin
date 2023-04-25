import { useEffect, useState } from "react";

import { Editor, EditorState, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";

import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";

import { contentToEditorState } from "./helpers";

const StyledBox = styled(Box)(() => ({
  marginBottom: "8px",
}));

import styles from "./rich-text-editor.module.css";

function StyledEditorButton({ active, label, onToggle, style }) {
  const buttonClassNames = [styles.button, active && styles.buttonActive]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={buttonClassNames}
      onClick={(e) => {
        e.preventDefault();
        onToggle(style);
      }}
    >
      {label}
    </button>
  );
}

const BLOCK_TYPE_CONTROLS = [
  { label: "Title", style: "header-two" },
  { label: "Unordered List", style: "unordered-list-item" },
  { label: "Ordered List", style: "ordered-list-item" },
];

const INLINE_TYPE_CONTROLS = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
];

function RichtextEditor({ onChange: onContentChange, content, error }) {
  const [editorState, setEditorState] = useState(() =>
    content ? contentToEditorState(content) : EditorState.createEmpty()
  );

  const onChange = (newEditorState) => {
    onContentChange(stateToHTML(newEditorState.getCurrentContent()));
    setEditorState(newEditorState);
  };

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const currentStyle = editorState.getCurrentInlineStyle();

  const onToggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const onToggleInlineType = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  return (
    <StyledBox>
      <div className={styles.container}>
        <div className={styles.controls}>
          {BLOCK_TYPE_CONTROLS.map((control) => (
            <StyledEditorButton
              key={control.label}
              label={control.label}
              onToggle={onToggleBlockType}
              active={control.style === blockType}
              style={control.style}
            />
          ))}

          {INLINE_TYPE_CONTROLS.map((control) => (
            <StyledEditorButton
              key={control.label}
              label={control.label}
              onToggle={onToggleInlineType}
              active={currentStyle.has(control.style)}
              style={control.style}
            />
          ))}
        </div>
        <div className={styles.editor}>
          <Editor
            editorState={editorState}
            onChange={onChange}
            placeholder="Add Content"
            handleKeyCommand={handleKeyCommand}
          />
        </div>
        <style>{`
.${styles.editor} .public-DraftEditorPlaceholder-root,
.${styles.editor} .public-DraftEditor-content {
  margin: 0 -15px -15px;
  padding: 15px;
}


.${styles.editor}  .public-DraftEditor-content {
  min-height: 100px;
}

.${styles.editor} .RichEditor-blockquote {
  border-left: 5px solid #eee;
  color: #666;
  font-family: 'Hoefler Text', 'Georgia', serif;
  font-style: italic;
  margin: 16px 0;
  padding: 10px 20px;
}

.${styles.editor} .public-DraftStyleDefault-pre {
  background-color: rgba(0, 0, 0, 0.05);
  font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
  font-size: 16px;
  padding: 20px;
}
        `}</style>
      </div>
      {error !== undefined ? <p className={styles.error}>{error}</p> : null}
    </StyledBox>
  );
}

export default RichtextEditor;
