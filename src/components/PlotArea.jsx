import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Line } from "react-chartjs-2";
import moodData from "../data/moodData.json";
import satisfactionData from "../data/satisfactionData.json";
import categoricalData from "../data/catData.json";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function calculatePearsonCorrelation(x, y) {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const n = x.length;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
    sumY2 += y[i] * y[i];
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );
  if (denominator === 0) return 0; // Avoid division by zero

  return numerator / denominator;
}

function calculateBestFitLine(x, y) {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  const n = x.length;

  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i];
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function PlotArea() {
  const [chartData, setChartData] = useState({});
  const [xAxisVariable, setXAxisVariable] = useState(null);
  const [yAxisVariable, setYAxisVariable] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  // Mapping to link variable names to data
  const dataMapping = {
    PositiveMood: moodData.PositiveMood,
    NegativeMood: moodData.NegativeMood,
    LifeSatisfaction: satisfactionData.LifeSatisfaction,
    Time: categoricalData.Time,
    Group: categoricalData.Group,
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
    // Check if the variable is meant for the x-axis or y-axis
    if (axis === "x") {
      setXAxisVariable(variableName);
    } else if (axis === "y") {
      setYAxisVariable(variableName);
    }
    updateChartData(); // Call updateChartData without parameters
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

  const updateChartData = () => {
    let scatterData = [];
    let lineData = [];

    if (xAxisVariable && yAxisVariable) {
      // Map both x and y data when both variables are selected
      scatterData = dataMapping[yAxisVariable].map((y, index) => ({
        x: dataMapping[xAxisVariable][index], // Use actual x-axis data
        y,
      }));
      // Calculate the line of best fit
      const { slope, intercept } = calculateBestFitLine(
        dataMapping[xAxisVariable],
        dataMapping[yAxisVariable]
      );

      // Create the line data using the slope and intercept
      lineData = scatterData.map((point) => ({
        x: point.x,
        y: slope * point.x + intercept,
      }));
    }

    // Set the chart data with the scatter and line datasets
    setChartData({
      datasets: [
        {
          label: yAxisVariable ? yAxisVariable : "Y-Axis",
          data: scatterData,
          backgroundColor: "rgba(75, 192, 192, 1)",
          type: "scatter",
        },
        {
          label: "Line of Best Fit",
          data: lineData,
          borderColor: "#478eff",
          type: "line",
          fill: false,
        },
      ],
    });
  };

  // Call updateChartData in useEffect without parameters
  useEffect(() => {
    updateChartData();
    if (xAxisVariable && yAxisVariable) {
      const corrValue = calculatePearsonCorrelation(
        dataMapping[xAxisVariable],
        dataMapping[yAxisVariable]
      );
      setCorrelation(corrValue); // Store the correlation value
    } else {
      setCorrelation(null); // Reset the correlation when one or both variables are not selected
    }
  }, [xAxisVariable, yAxisVariable]);

  useEffect(() => {});
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
          <div
            ref={dropRef}
            style={{
              width: "600px", // Adjust the width as needed
              height: "320px", // Adjust the height as needed
            }}
          >
            {Object.keys(chartData).length !== 0 && (
              <Scatter options={options} data={chartData} />
            )}
          </div>

          <div
            ref={xDropRef}
            style={{
              backgroundColor: "lightcoral",
              color: "white",
              textAlign: "center",
              padding: "10px",
              width: "700px", // Match the width of the chart
            }}
          >
            Drop X-Axis Variable Here
          </div>
        </div>
      </div>
      {correlation !== null && (
        <div style={{ margin: "20px", fontSize: "1.2rem" }}>
          Correlation: {correlation.toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default PlotArea;
