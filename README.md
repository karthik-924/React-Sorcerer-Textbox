# Draft.js Editor with State Persistence

This project is a React application that implements a text editor using Draft.js. The editor includes functionality to format text as headings, bold, red, or underline based on specific input patterns. Additionally, the editor content is persisted to local storage, allowing users to retain their work even after closing or refreshing the page.

## Components

The layout consists of three main components:

1. **Title**: Displays the title of the editor.
2. **Button**: Allows users to save the content of the editor to local storage.
3. **Editor**: Implements the Draft.js editor where users can type and format text.

## Editor Functionality

The Draft.js editor includes the following features:

- Typing `#` at the beginning of a line followed by a space formats the next typed text as a heading.
- Typing `*` at the beginning of a line followed by a space makes the next typed text bold.
- Typing `##` at the beginning of a line followed by a space makes the next typed text red.
- Typing `###` at the beginning of a line followed by a space underlines the next typed text.

## Local Storage Persistence

- Pressing the "Save" button stores the content of the editor to local storage.
- On page refresh, the saved content is automatically loaded back into the editor, allowing users to continue editing from where they left off.

## Installation and Usage

1. Clone the repository:

git clone https://github.com/your_username/draft-js-editor.git

2. Navigate to the project directory:

cd draft-js-editor

3. Install dependencies:

npm install

4. Start the development server:

npm run dev

5. Open your browser and visit `http://localhost:5173` to use the Draft.js editor.

## Credits

This project was created by Karthik Emmadi.