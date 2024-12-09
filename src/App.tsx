import React from "react";
import PhaserGame from "./Components/PhaserGame";

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Don't Crash</h1>
      <PhaserGame />
    </div>
  );
};

export default App;
