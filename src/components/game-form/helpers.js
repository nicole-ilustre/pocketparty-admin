import { EditorState, convertFromHTML, ContentState } from "draft-js";

export const getContent = (game) => {
  let content = `
    <h2>Setup</h2>
    <ol>
    ${game.setup
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => `<li>${line}</li>`)
      .join(" ")}
    </ol>
    <h2>Gameplay</h2>
    <ol>
    ${game.gameplay
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => `<li>${line}</li>`)
      .join(" ")}
    </ol>
  `;

  if (game.examples !== undefined && game.examples.trim().length > 0) {
    content += `
    <h2>Examples</h2>
    <ul >
      ${game.examples
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => `<li>${line}</li>`)
        .join(" ")}
    </ul>
    `;
  }

  return content;
};

export const contentToEditorState = (html) => {
  const blocksFromHTML = convertFromHTML(html);
  const content = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  return EditorState.createWithContent(content);
};
