import React from 'react';
import '../styles/Overlay.css';

const Overlay = ({ children, className, rounded, ...props }) => {
	let _className = rounded ? 'overlay rounded' : 'overlay';
	_className = className ? `${_className} ${className}` : _className;
	return (
		<div className={_className} {...props}>
			{children}
		</div>
	);
};

export default Overlay;
