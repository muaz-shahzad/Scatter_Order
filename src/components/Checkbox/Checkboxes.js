import React from 'react';

const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="control-row">
      <input 
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label className='ms-2' htmlFor={id}>{label}</label>

    </div>
  );
};

export default Checkbox;
