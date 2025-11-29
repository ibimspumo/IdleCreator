# Idle Creator

Idle Creator is a web-based application designed to facilitate the creation of idle games. It provides an intuitive suite of tools including a pixel art editor, a visual logic editor for game mechanics, and a game engine to bring your idle game ideas to life.

## Features

*   **Pixel Art Editor**: Create and edit pixel art assets directly within the application.
*   **Visual Logic Editor**: Design complex game logic and interactions using a node-based interface (powered by React Flow).
*   **Game Editor**: Configure game elements, properties, and overall game structure.
*   **Game Engine**: A dedicated engine (`GameEngine.js`, `PrestigeEngine.js`) to run and manage the idle game simulations, including prestige mechanics.
*   **Game Player**: Test and play your created idle games.
*   **Preview System**: See real-time previews of game elements and cards.
*   **Data Compression**: Efficiently handle and store game data.

## Tech Stack

*   **Frontend**: React
*   **Build Tool**: Vite
*   **Styling**: CSS Modules
*   **Logic Editor**: React Flow (inferred from `CustomNodes.jsx`, `LogicEditor.jsx` patterns)
*   **Language**: JavaScript

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Make sure you have the following installed:

*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/idlecreator.git
    cd idlecreator
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will typically be available at `http://localhost:5173/`.

### Building for Production

To create a production-ready build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be located in the `dist/` directory.

## Project Structure

The project follows a component-based architecture within the `src/` directory:

*   `src/App.jsx`: Main application component.
*   `src/main.jsx`: Entry point for the React application.
*   `src/components/`: Contains various UI components organized by feature.
    *   `Editor/`: Components related to the main game editor, pixel art, and property panels.
    *   `LogicEditor/`: Components for the node-based logic editor.
    *   `Player/`: Components for playing the game.
    *   `Preview/`: Components for displaying game element previews.
*   `src/engine/`: Core game engine logic, including `GameEngine.js` and `PrestigeEngine.js`.
*   `src/styles/`: Contains individual CSS files for styling different components and sections.
*   `src/utils/`: Utility functions, such as data compression and formatters.

## Contribution

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the [Your License Here] - see the `LICENSE.md` file for details.