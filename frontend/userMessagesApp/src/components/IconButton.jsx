import React from 'react';
import '../styles/IconButton.css';
const IconButton = ({ children, className, ...props }) => {
	return (
		<div className='icon-button-container'>
			<button
				className={className ? `icon-button ${className}` : 'icon-button'}
				{...props}>
				{children}
			</button>
		</div>
	);
};

export default IconButton;
