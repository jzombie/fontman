import React from 'react';
import './style.css';

/**
 * Dynamically generated ReactComponent.
 */ 
const DynamicIcon = (props) => {
  const { className, ...propsRest } = props;
  
  return (
    <i
      {...propsRest}
      className={`if251ea46518642439426be5c016a0734-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
