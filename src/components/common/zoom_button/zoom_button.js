import React from 'react';


// This is a function component that will provided 
// the user with a button to zoom in or out incase 
// they don't have a mouse or keyboard option.

export const ZoomButton = ({type, handleViewportChange, currentZoom}) => (
    <span onClick ={() =>handleViewportChange({zoom:type === '+' ? currentZoom+=0.5: currentZoom-=0.5})}
    >{type}</span>


)