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
      className={`i5ba1f1dbe18a457a813734253a5ae0ab-icon${className ? ` ${className}` : ''}`}
    />
  );
};

export default DynamicIcon;
