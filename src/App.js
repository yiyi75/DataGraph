import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Variable from "./components/Variable";
import PlotArea from "./components/PlotArea";
import PlotComplexData from "./components/PlotMultilevelArea";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
        {/* Update the name props to match your dataMapping keys */}
        <Variable name="PositiveMood" />
        <Variable name="NegativeMood" />
        <Variable name="LifeSatisfaction" />
      </div>
      <PlotArea />
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
        {/* Update the name props to match your dataMapping keys */}
        <Variable name="Time" />
        <Variable name="LifeSatisfaction" />
        <Variable name="EmotionRegulation" />
        <Variable name="Happiness" />
        <Variable name="Sadness" />
      </div>
      <PlotComplexData />
    </DndProvider>
  );
}

export default App;
