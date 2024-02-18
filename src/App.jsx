import { useEffect, useRef, useState } from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  OrderedSet,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import ReactDOM from "react-dom";
import "draft-js/dist/Draft.css";
import "./App.css";

function App() {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );
  // console.log(editorState)
  // const prevEditorStateRef = useRef(editorState);

  useEffect(() => {
    // console.log(
    //   "Previous inline styles:",
    //   prevEditorStateRef.current.getCurrentInlineStyle()
    // );
    // console.log("Current inline styles:", editorState.getCurrentInlineStyle());
    // prevEditorStateRef.current = editorState;
    // localStorage.removeItem("content");
    loadContent();
  }, []);

  const handleChange = (newEditorState) => {
    setEditorState((prevEditorState) => {
      // console.log(prevEditorState.getCurrentInlineStyle());
      // console.log(newEditorState.getCurrentInlineStyle());
      return newEditorState;
    });
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
    if (command === "remove-style") {
      const currentStyle = editorState.getCurrentInlineStyle();
      let newEditorState = editorState;

      // Remove each style if present
      // console.log(currentStyle);
      ["header-one", "BOLD", "RED", "UNDERLINE"].forEach((style) => {
        if (currentStyle.has(style)) {
          const selection = editorState.getSelection();
          const contentState = editorState.getCurrentContent();
          const newContentState = Modifier.splitBlock(contentState, selection);
          newEditorState = EditorState.push(
            newEditorState,
            newContentState,
            "split-block"
          );
          newEditorState = EditorState.setInlineStyleOverride(
            newEditorState,
            currentStyle.remove(style)
          );
          // console.log(newEditorState.getCurrentInlineStyle());
        }
      });

      handleChange(newEditorState);
      return "handled";
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars, editorState) => {
    const currentStyles = editorState.getCurrentInlineStyle();
    let newEditorState = editorState;
    const selection = newEditorState.getSelection();
    const contentState = newEditorState.getCurrentContent();
    const block = contentState.getBlockForKey(selection.getStartKey());
    const text = block.getText();
    if (
      chars === " " &&
      (text === "#" || text === "*" || text === "##" || text === "###")
    ) {
      const newContentState = Modifier.replaceText(
        contentState,
        selection.merge({
          anchorOffset: selection.getStartOffset() - text.length,
          focusOffset: selection.getStartOffset(),
        }),
        ""
      );

      let inlineStyle;
      switch (text) {
        case "#":
          inlineStyle = "header-one";
          break;
        case "*":
          inlineStyle = "BOLD";
          break;
        case "##":
          inlineStyle = "RED";
          break;
        case "###":
          inlineStyle = "UNDERLINE";
          break;
        default:
          inlineStyle = "unstyled";
      }

      if (inlineStyle) {
        var newState = EditorState.push(
          newEditorState,
          newContentState,
          "remove-text"
        );
        const oldStyle = newState.getCurrentInlineStyle();

        oldStyle.forEach((style) => {
          newState = RichUtils.toggleInlineStyle(newState, style);
        });

        const withInlineStyle = RichUtils.toggleInlineStyle(
          newState,
          inlineStyle
        );
        handleChange(withInlineStyle);
        return "handled";
      }
    }

    return "not-handled";
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateJSON = convertToRaw(contentState);
    localStorage.setItem("content", JSON.stringify(contentStateJSON));
  };
  
  const loadContent = () => {
    const savedContent = localStorage.getItem("content");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      console.log(contentState);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
      <div className="w-full flex max-sm:flex-col gap-5 items-center justify-center">
        <p className="text-base font-semibold text-center">Demo editor by Karthik Emmadi</p>
        <button
          onClick={handleSave}
          className="absolute text-black box-shadow max-sm:relative w-24 bg-gray-100 h-8 border-[3px] border-solid border-black right-10 max-sm:right-0"
        >
          Save
        </button>
      </div>
      <div className="w-[90%] h-[80%] p-5 border border-solid border-blue-500">
        <Editor
          editorState={editorState}
          onChange={handleChange}
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={myKeyBindingFn}
          customStyleMap={styles}
        />
      </div>
    </div>
  );
}

export default App;
