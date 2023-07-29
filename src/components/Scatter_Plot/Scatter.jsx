import React, { forwardRef, useState, useEffect, useRef } from 'react';
import Checkbox from '../Checkbox/Checkboxes';
import Dropdown from '../Dropdown/Dropdown';
import Graph from '../Graph/Graph';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScatterPlot = ({ data }) => {
    const graphRef = useRef(null);
    const [xArray, setXArray] = useState([]);
    const [yArray, setYArray] = useState([]);
    const [xTitle, setXTitle] = useState('All');
    const [yTitle, setYTitle] = useState('All');
    const [xValue, setXValue] = useState('All');
    const [yValue, setYValue] = useState('All');
    const [xLogChecked, setXLogChecked] = useState(false);
    const [yLogChecked, setYLogChecked] = useState(false);
    const [bestFitChecked, setBestFitChecked] = useState(false);
    const [logScaleChecked, setLogScaleChecked] = useState(false);
    const [selectedPoints, setSelectedPoints] = useState(new Set());
    const [selectedPointsData, setSelectedPointsData] = useState([]);

    useEffect(() => {
        updateDataArrays();
    }, [xValue, yValue, data]);

    useEffect(() => {
        // Update selectedPointsData with the selected data
        const updatedSelectedPointsData = Array.from(selectedPoints).map((index) => data[index]);
        setSelectedPointsData(updatedSelectedPointsData);
    }, [selectedPoints, data]);

    const updateDataArrays = () => {
        const xValues = data.map((item) => item[xValue]);
        const yValues = data.map((item) => item[yValue]);

        setXArray(xValues);
        setYArray(yValues);
        setXTitle(xValue);
        setYTitle(yValue);
    };

    const handleXChange = (event) => {
        setXValue(event.target.value);
    };

    const handleYChange = (event) => {
        setYValue(event.target.value);
    };

    const handleXLogChange = () => {
        setXLogChecked(!xLogChecked);
    };

    const handleYLogChange = () => {
        setYLogChecked(!yLogChecked);
    };

    const handleBestFitChange = () => {
        setBestFitChecked(!bestFitChecked);
    };

    const handleLogScaleChange = () => {
        setLogScaleChecked(!logScaleChecked);
        setXLogChecked(!xLogChecked); // Toggle the xLogChecked state
        setYLogChecked(!yLogChecked); // Toggle the yLogChecked state
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
        const updatedSelectedPoints = new Set();
        if (eventData && eventData.points) {
            eventData.points.forEach((point) => {
                updatedSelectedPoints.add(point.pointIndex);
            });
        }
        setSelectedPoints(updatedSelectedPoints);
    };

    const handleSelectedPointsUpdate = (selectedPointsData) => {
        setSelectedPointsData(selectedPointsData);
    };

    const handleLassoOrBoxSelection = (updatedSelectedPoints) => {
        setSelectedPoints(updatedSelectedPoints);
    };
    return (
        <>
            <div className="container-fluid mt-5 ">
                <div className="row">
                    <div className="col-lg-3" style={{ marginTop: "13%" }}>
                        <Dropdown
                            id="yAxisSelect"
                            label="Y-Axis"
                            options={[
                                'All',
                                'Molecular Weight',
                                'TPSA',
                                'Num Rotatable Bonds',
                                'Num H Donors Lipinski',
                                'Num H Acceptors Lipinski',
                                'ChemAxon logP',
                                'ChemAxon logD 7.4',
                                'ChemAxon pKa',
                                'Lipinski Rule of 5',
                                'QED',
                                'Pfizer 3-75 Rule',
                                'CNS MPO',
                                'ABScore',
                                'AlogP',
                                'F SP3',
                                'K2',
                                'MR',
                                'Num Aromatic Heterocycles',
                                'Num Aromatic Rings',
                                'Num H Acceptors',
                                'Num H Donors',
                                'Num Atoms Heavy',
                                'PHI',
                                'Predicted Caco2 Efflux Ratio',
                                'Predicted Caco2 Papp AB',
                                'Predicted Cell Permeability (MDCK)',
                                'Predicted Clint,hep unbound (Human)',
                                'Predicted Clint,hep unbound (Mouse)',
                                'Predicted Clint,hep unbound (Rat)',
                                'Predicted Clint,mic unbound (Mouse)',
                                'Predicted Clint,mic unbound (Rat)',
                                'Predicted Efflux Ratio (MDCK-MDR1)',
                                'Predicted fu,brain (Rat)',
                                'Predicted fu,mic (Human)',
                                'Predicted fu,plasma (Rodent)',
                                'Predicted in vivo CLp,u (Rat)',
                                'Predicted Permeability (PAMPA)',
                                'Predicted Solubility (Nephelometry)',
                                'Predicted Solubility (UV)',
                                'Predicted Vss (Mouse)',
                                'Predicted Vss (Rat)'
                            ]}
                            value={yValue}
                            onChange={handleYChange}
                        />
                    </div>
                    <div className="col-lg-6" >
                        <Graph
                            data={data}
                            xArray={xArray}
                            yArray={yArray}
                            xTitle={xTitle}
                            yTitle={yTitle}
                            bestFitChecked={bestFitChecked}
                            xLogChecked={xLogChecked}
                            yLogChecked={yLogChecked}
                            selectedPoints={selectedPoints}
                            handleLogScaleChange={handleLogScaleChange}
                            graphRef={graphRef}
                            onPointSelection={handlePointSelection} // Pass the function here
                            onLassoSelection={handleLassoSelection}
                            onUpdateSelectedPointsData={handleSelectedPointsUpdate}
                            onLassoOrBoxSelection={handleLassoOrBoxSelection}
                        />


                    </div>
                    <div className="col-lg-2" style={{ marginTop: "13%" }}>
                        <div className="checkbox-container">
                            <Checkbox
                                id="logScaleCheckbox"
                                label="Log Scale"
                                checked={logScaleChecked}
                                onChange={handleLogScaleChange}
                            />
                        </div>
                        <div className="checkbox-container ms-4 mt-1">
                            <Checkbox
                                id="xLogCheckbox"
                                label="X-axis Logarithmic"
                                checked={xLogChecked}
                                onChange={handleXLogChange}
                            />
                        </div>
                        <div className="checkbox-container ms-4 mt-1">
                            <Checkbox
                                id="yLogCheckbox"
                                label="Y-axis Logarithmic"
                                checked={yLogChecked}
                                onChange={handleYLogChange}
                            />
                        </div>
                        <div className="checkbox-container mt-1">
                            <Checkbox
                                id="bestFitCheckbox"
                                label="Show Line of Best Fit"
                                checked={bestFitChecked}
                                onChange={handleBestFitChange}
                            />
                        </div>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-lg-5'>

                    </div>
                    <div className='col-lg-3'>
                        <Dropdown
                            id="xAxisSelect"
                            label="X-Axis"
                            options={[
                                'All',
                                'Molecular Weight',
                                'TPSA',
                                'Num Rotatable Bonds',
                                'Num H Donors Lipinski',
                                'Num H Acceptors Lipinski',
                                'ChemAxon logP',
                                'ChemAxon logD 7.4',
                                'ChemAxon pKa',
                                'Lipinski Rule of 5',
                                'QED',
                                'Pfizer 3-75 Rule',
                                'CNS MPO',
                                'ABScore',
                                'AlogP',
                                'F SP3',
                                'K2',
                                'MR',
                                'Num Aromatic Heterocycles',
                                'Num Aromatic Rings',
                                'Num H Acceptors',
                                'Num H Donors',
                                'Num Atoms Heavy',
                                'PHI',
                                'Predicted Caco2 Efflux Ratio',
                                'Predicted Caco2 Papp AB',
                                'Predicted Cell Permeability (MDCK)',
                                'Predicted Clint,hep unbound (Human)',
                                'Predicted Clint,hep unbound (Mouse)',
                                'Predicted Clint,hep unbound (Rat)',
                                'Predicted Clint,mic unbound (Mouse)',
                                'Predicted Clint,mic unbound (Rat)',
                                'Predicted Efflux Ratio (MDCK-MDR1)',
                                'Predicted fu,brain (Rat)',
                                'Predicted fu,mic (Human)',
                                'Predicted fu,plasma (Rodent)',
                                'Predicted in vivo CLp,u (Rat)',
                                'Predicted Permeability (PAMPA)',
                                'Predicted Solubility (Nephelometry)',
                                'Predicted Solubility (UV)',
                                'Predicted Vss (Mouse)',
                                'Predicted Vss (Rat)'
                            ]}
                            value={xValue}
                            onChange={handleXChange}
                        />

                    </div>
                    <div className='col-lg-5'>

                    </div>
                </div>
                <div className="row">
                    <div className='col-lg-12'>
                        {selectedPointsData.length > 0 && (
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
                                        {selectedPointsData.map((selectedData, index) => (
                                            <tr key={index}>
                                                {Object.values(selectedData).map((value, idx) => (
                                                    <td key={idx}>{value}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>
                </div>

            </div>




        </>
    );






}

export default ScatterPlot