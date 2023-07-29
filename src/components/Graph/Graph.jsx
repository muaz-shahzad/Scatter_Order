import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist';

const Graph = ({ data, xArray, yArray, xTitle, yTitle, bestFitChecked, xLogChecked, yLogChecked, selectedPoints, graphRef, onUpdateSelectedPointsData, onLassoSelection, onPointSelection, onLassoOrBoxSelection }) => {
    
    
    const handleSelection = (eventData) => {
        let updatedSelectedPoints = new Set(selectedPoints);
        if (eventData && eventData.points) {
            eventData.points.forEach((point) => {
                updatedSelectedPoints.add(point.pointIndex);
            });
        } else {
            updatedSelectedPoints.clear();
        }
        onLassoOrBoxSelection(updatedSelectedPoints);
    };

    useEffect(() => {
        if (graphRef.current) {
            updateGraph();
            graphRef.current.on('plotly_selected', handleSelection); // Update this line
            graphRef.current.on('plotly_click', handlePointClick);
            return () => {
                graphRef.current.removeAllListeners();
            };
        }
    }, [xArray, yArray, xTitle, yTitle, bestFitChecked, xLogChecked, yLogChecked, selectedPoints, graphRef]);

    useEffect(() => {
        if (!graphRef.current) {
            graphRef.current = Plotly.newPlot('graph', [], {});
        }

        return () => {
            if (graphRef.current) {
                graphRef.current.removeAllListeners();
            }
        };
    }, [graphRef]);

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

        // graphRef.current.innerHTML = '';

        Plotly.newPlot(graphRef.current, graphData, layout).catch((error) => {
            console.error('Error plotting the graph:', error);
        });

        graphRef.current.on('plotly_click', handlePointClick);


    };
    
    const handlePointClick = (eventData) => {
        if (eventData && eventData.points) {
            const selectedPointIndex = eventData.points[0].pointIndex;
            onPointSelection(selectedPointIndex);
        }
    };
    const handlePointSelection = (selectedPointIndex) => {
        const updatedSelectedPoints = new Set(selectedPoints);
        if (updatedSelectedPoints.has(selectedPointIndex)) {
            updatedSelectedPoints.delete(selectedPointIndex);
        } else {
            updatedSelectedPoints.add(selectedPointIndex);
        }
        onUpdateSelectedPointsData(Array.from(updatedSelectedPoints).map(index => data[index]));

        // Call the onPointSelection function passed from ScatterPlot component
        onPointSelection(selectedPointIndex);
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
        onLassoSelection(updatedSelectedPoints);
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


    return (
        <>
            <div id="graph" ref={graphRef}>

            </div>

        </>
    );
};

export default Graph;