import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist';
// import '../Scatter_Plot/Scatter.css'

const Testing = ({ data, xArray, yArray, xTitle, yTitle, bestFitChecked, xLogChecked, yLogChecked }) => {
    const graphRef = useRef(null);

    // State to store the selected data points
    const [selectedPoints, setSelectedPoints] = useState(new Set());

    useEffect(() => {
        updateGraph();
        return () => {
            Plotly.purge(graphRef.current);
        };
    }, [xArray, yArray, xTitle, yTitle, bestFitChecked, xLogChecked, yLogChecked, selectedPoints]);

    const updateGraph = () => {
        const xValues = xLogChecked ? xArray.map((value) => Math.log10(value)) : xArray;
        const yValues = yLogChecked ? yArray.map((value) => Math.log10(value)) : yArray;

        const graphData = [
            {
                x: xValues,
                y: yValues,
                mode: 'markers',
                type: 'scatter',
                marker: {
                    size: 8,
                    color: xValues.map((_, index) => (selectedPoints.has(index) ? 'red' : 'black')),
                },
                text: data.map((item) => item.SMILES),
                hovertemplate: `${xTitle}: %{x}<br>${yTitle}: %{y}<br>SMILES: %{text}<extra></extra>`,
            },
        ];

        if (bestFitChecked) {
            const bestFitLine = calculateBestFitLine(xValues, yValues);
            graphData.push(bestFitLine);
        }

        const layout = {
            title: `${yTitle} VS ${xTitle}`,
            xaxis: {
                title: xTitle,
                type: xLogChecked ? 'log' : 'linear',
            },
            yaxis: {
                title: yTitle,
                type: yLogChecked ? 'log' : 'linear',
            },
            showlegend: true,
            dragmode: 'select', // Enable lasso selection
        };

        graphRef.current.innerHTML = '';

        Plotly.newPlot(graphRef.current, graphData, layout).catch((error) => {
            console.error('Error plotting the graph:', error);
        });

        // Add event listener for plotly_click event
        graphRef.current.on('plotly_click', (eventData) => {
            const selectedPointIndex = eventData.points[0].pointIndex;
            handlePointSelection(selectedPointIndex);
        });

        // Add event listener for plotly_selected event (lasso selection)
        graphRef.current.on('plotly_selected', (eventData) => {
            handleLassoSelection(eventData);
        });
    };




    const calculateBestFitLine = (xValues, yValues) => {
        const sumX = xValues.reduce((acc, val) => acc + val, 0);
        const sumY = yValues.reduce((acc, val) => acc + val, 0);
        const sumXY = xValues.reduce((acc, val, index) => acc + val * yValues[index], 0);
        const sumXX = xValues.reduce((acc, val) => acc + val * val, 0);
        const size = xValues.length;

        const slope = (size * sumXY - sumX * sumY) / (size * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / size;

        const bestFitLine = {
            type: 'scatter',
            mode: 'lines',
            x: xValues,
            y: xValues.map((xi) => slope * xi + intercept),
            name: 'Best Fit',
            line: {
                color: 'red',
            },
        };

        return bestFitLine;
    };
    const handlePointSelection = (selectedPointIndex) => {
        const updatedSelectedPoints = new Set(selectedPoints);
        if (updatedSelectedPoints.has(selectedPointIndex)) {
            updatedSelectedPoints.delete(selectedPointIndex);
        } else {
            updatedSelectedPoints.add(selectedPointIndex);
        }
        setSelectedPoints(updatedSelectedPoints);
    };

    const handleLassoSelection = (eventData) => {
        let updatedSelectedPoints = new Set(selectedPoints);
        if (eventData && eventData.points) {
            eventData.points.forEach((point) => {
                updatedSelectedPoints.add(point.pointIndex);
            });
        } else {
            updatedSelectedPoints.clear();
        }
        setSelectedPoints(updatedSelectedPoints);
    };

    return (
        <>
            <div id="graph" ref={graphRef}>

            </div>
            {/* Table to display selected data */}
            {selectedPoints.size > 0 && (
                <div className="table-container mt-4">
                    <table className="table">
                        <thead>
                            <tr>
                                {Object.keys(data[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from(selectedPoints).map((index) => (
                                <tr key={index}>
                                    {Object.values(data[index]).map((value, idx) => (
                                        <td key={idx}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default Testing;