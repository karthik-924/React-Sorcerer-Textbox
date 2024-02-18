import React from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";
import ReactDOM from "react-dom";
import "draft-js/dist/Draft.css";

const TextEditor = ( props ) => {
  const { editorState, setEditorState } = props;
  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const myKeyBindingFn = (e) => {
    if (e.keyCode === 13) {
      const currentStyle = editorState.getCurrentInlineStyle();
      if (
        currentStyle.has("header-one") ||
        currentStyle.has("BOLD") ||
        currentStyle.has("RED") ||
        currentStyle.has("UNDERLINE")
      ) {
        return "remove-style";
      }
    }
    return getDefaultKeyBinding(e);
  };

  const styles = {
    "header-one": {
      fontSize: "2em",
      fontWeight: "bold",
      color: "black",
    },
    RED: {
      color: "red",
    },
  };

  const handleKeyCommand = (command, editorState) => {
    console.log(command);
    if (command === "remove-style") {
      const currentStyle = editorState.getCurrentInlineStyle();
      if (currentStyle.has("header-one")) {
        const newEditorState = EditorState.setInlineStyleOverride(
          editorState,
          currentStyle.remove("header-one")
        );
        const selection = newEditorState.getSelection();
        const contentState = newEditorState.getCurrentContent();
        const newContentState = Modifier.splitBlock(contentState, selection);
        const finalEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "split-block"
        );
        handleChange(finalEditorState);
        return "handled";
      }
      if (currentStyle.has("BOLD")) {
        const newEditorState = EditorState.setInlineStyleOverride(
          editorState,
          currentStyle.remove("BOLD")
        );
        const selection = newEditorState.getSelection();
        const contentState = newEditorState.getCurrentContent();
        const newContentState = Modifier.splitBlock(contentState, selection);
        const finalEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "split-block"
        );
        handleChange(finalEditorState);
        return "handled";
      }
      if (currentStyle.has("RED")) {
        const newEditorState = EditorState.setInlineStyleOverride(
          editorState,
          currentStyle.remove("RED")
        );
        const selection = newEditorState.getSelection();
        const contentState = newEditorState.getCurrentContent();
        const newContentState = Modifier.splitBlock(contentState, selection);
        const finalEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "split-block"
        );
        handleChange(finalEditorState);
        return "handled";
      }
      if (currentStyle.has("UNDERLINE")) {
        const newEditorState = EditorState.setInlineStyleOverride(
          editorState,
          currentStyle.remove("UNDERLINE")
        );
        const selection = newEditorState.getSelection();
        const contentState = newEditorState.getCurrentContent();
        const newContentState = Modifier.splitBlock(contentState, selection);
        const finalEditorState = EditorState.push(
          newEditorState,
          newContentState,
          "split-block"
        );
        handleChange(finalEditorState);
        return "handled";
      }
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    console.log(chars, text);
    if (chars === " " && text === "#") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      const newState = EditorState.push(
        editorState,
        newContentState,
        "remove-text"
      );

      const withHeading = RichUtils.toggleInlineStyle(newState, "header-one");
      handleChange(withHeading);
      return "handled";
    } else if (chars === " " && text === "*") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 1,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      const newState = EditorState.push(
        editorState,
        newContentState,
        "remove-text"
      );

      const withHeading = RichUtils.toggleInlineStyle(newState, "BOLD");
      handleChange(withHeading);
      return "handled";
    } else if (chars === " " && text === "##") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 2,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      const newState = EditorState.push(
        editorState,
        newContentState,
        "remove-text"
      );

      const withHeading = RichUtils.toggleInlineStyle(newState, "RED");
      handleChange(withHeading);
      return "handled";
    } else if (chars === " " && text === "###") {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 3,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      const newState = EditorState.push(
        editorState,
        newContentState,
        "remove-text"
      );

      const withHeading = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
      handleChange(withHeading);
      return "handled";
    }
    return "not-handled";
  };
  return (
    <Editor
      editorState={editorState}
      onChange={handleChange}
      handleBeforeInput={handleBeforeInput}
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={myKeyBindingFn}
      customStyleMap={styles}
    />
  );
};

export default TextEditor;
