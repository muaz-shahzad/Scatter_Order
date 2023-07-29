import React from 'react';

const Dropdown = ({ id, label, options, value, onChange }) => {
  return (
    <div className="control-row">
      <label htmlFor={id}>{label}: </label>
      <select className='ms-2' style={{width: "auto"}} id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
