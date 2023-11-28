import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useDrop } from "react-dnd";
import categoricalData from "../data/catData.json";
import swlsData from "../data/SWLSData.json";
import erqData from "../data/ERQData.json";
import happinessData from "../data/HappinessData.json";
import sadnessData from "../data/SadnessData.json";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PlotComplexData() {
  const [chartData, setChartData] = useState({});
  const [xAxisVariable, setXAxisVariable] = useState(null);
  const [yAxisVariable, setYAxisVariable] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [zScore, setZScore] = useState(null);
  const [isSignificant, setIsSignificant] = useState(null);

  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };
  // Mapping to link variable names to data
  const dataMapping = {
    Time: categoricalData.Time,
    LifeSatisfaction: swlsData,
    EmotionRegulation: erqData,
    Happiness: happinessData,
    Sadness: sadnessData,
  };

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "VARIABLE",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      handleDrop(item.name);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const handleDrop = (variableName, axis) => {
    if (axis === "x") {
      setXAxisVariable(variableName);
    } else if (axis === "y") {
      setYAxisVariable(variableName);
    }
  };

  // Make sure that the drop handlers are passing the correct axis
  const [, xDropRef] = useDrop({
    accept: "VARIABLE",
    drop: (item) => handleDrop(item.name, "x"),
  });

  const [, yDropRef] = useDrop({
    accept: "VARIABLE",
    drop: (item) => handleDrop(item.name, "y"),
  });

  const calculateAverage = (data) => {
    return data.reduce((total, value) => total + value, 0) / data.length;
  };

  const updateChartData = () => {
    if (xAxisVariable && yAxisVariable) {
      const labels = dataMapping["Time"];
      const yData = dataMapping[yAxisVariable];
      const averages = labels.map((label) => {
        const dataPoints = yData?.[label];
        return Array.isArray(dataPoints) ? calculateAverage(dataPoints) : null;
      });

      if (averages.every((avg) => typeof avg === "number")) {
        setChartData({
          labels: labels.map((label) => label.replace("Time", "Time ")),
          datasets: [
            {
              label: yAxisVariable,
              data: averages,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    if (xAxisVariable && yAxisVariable) {
      updateChartData();
    }
  }, [xAxisVariable, yAxisVariable]); // Dependency array ensures effect runs only when these variables change

  // Update the chart options to include axis labels
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisVariable || "X-Axis", // Replace with your axis title or variable name
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisVariable || "Y-Axis", // Replace with your axis title or variable name
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend if you don't need it
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack the child elements vertically
        alignItems: "center",
        justifyContent: "center",
        padding: "20px", // Add padding to ensure content is not flush against the edges
      }}
    >
      <button onClick={toggleChartType}>
        Switch to {chartType === "line" ? "Bar" : "Line"} Chart
      </button>
      <div
        style={{
          display: "flex", // Create a row flex container for Y-axis drop zone and the inner container
          flexDirection: "row", // Align children horizontally
          alignItems: "flex-start", // Center children vertically
        }}
      >
        <div
          ref={yDropRef}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)", // Rotate the text by 180 degrees
            backgroundColor: "lightblue",
            color: "white",
            textAlign: "center",
            padding: "10px",
            height: "300px", // Match the height of the chart
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Drop Y-Axis Variable Here
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0", // Reduce margin to minimize space around the chart
          }}
        >
          <div ref={dropRef} style={{ width: "600px", height: "320px" }}>
            {Object.keys(chartData).length !== 0 &&
              (chartType === "line" ? (
                <Line options={options} data={chartData} />
              ) : (
                <Bar options={options} data={chartData} />
              ))}
          </div>

          <div
            ref={xDropRef}
            style={{
              backgroundColor: "lightcoral",
              color: "white",
              textAlign: "center",
              padding: "10px",
              width: "700px",
            }}
          >
            Drop X-Axis Variable Here
          </div>
        </div>
      </div>
    </div>
  );
}
export default PlotComplexData;
