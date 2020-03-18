import React from 'react';
import ReactLoading from 'react-loading'
 
const Loader = ({ type, color }) => (
    <ReactLoading type="spinningBubbles" color="blue" height={'20%'} width={'20%'} />
);
 
export default Loader;