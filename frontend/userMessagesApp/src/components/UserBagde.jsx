import React from 'react';
import '../styles/UserBadge.css';
import DefaultProfileImage from '../assets/default-profile-image.png';

export const UserBagde = ({ children }) => {
	return <div className='badge'>{children}</div>;
};

export const UserBagdeImage = ({ src, ...props }) => {
	return (
		<img
			className='badge__img'
			src={src || DefaultProfileImage}
			title='Imágen de perfil'
			{...props}
		/>
	);
};

export const UserBadgeName = ({ children, ...props }) => {
	return (
		<p className='badge__name' {...props}>
			{children}
		</p>
	);
};
