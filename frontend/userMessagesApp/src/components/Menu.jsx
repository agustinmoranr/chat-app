import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../styles/Menu.css';

export const CLOSE_REASONS = {
	CLICK_OUTSIDE_MENU: 'clickOutside',
	SELECT_ITEM: 'selectItem',
};

export const Menu = ({ children, open, onClose }) => {
	const menuRef = useRef(null);
	const [positionToDispaly, setPositionToDisplay] = useState(null);

	useEffect(() => {
		if (!open) return;
		document.addEventListener('contextmenu', getPointer);
		document.addEventListener('click', onDomClick);

		return () => {
			document.removeEventListener('contextmenu', getPointer);
			document.removeEventListener('click', onDomClick);
		};
	}, [open]);

	function onDomClick(event) {
		const clickingMenu = event.target.matches('.menu');
		const clickingMenuItem = event.target.matches('.menu-item');
		let reason =
			!clickingMenu && !clickingMenuItem
				? CLOSE_REASONS.CLICK_OUTSIDE_MENU
				: clickingMenuItem
				? CLOSE_REASONS.SELECT_ITEM
				: null;
		if (!clickingMenu && open) {
			onClose(reason);
			setPositionToDisplay(null);
			menuRef.current?.classList.remove('show-menu');
		}
	}

	function getPointer(event) {
		setPositionToDisplay({ top: event.pageY, left: event.pageX });
		setTimeout(() => menuRef.current?.classList.add('show-menu'), 0);
	}

	return (
		open &&
		createPortal(
			<div ref={menuRef} className='menu' style={positionToDispaly}>
				<ul className='menu-list'>{children}</ul>
			</div>,

			document.body,
		)
	);
};

export const MenuItem = ({ children, onClick }) => {
	return (
		<li className='menu-item' onClick={onClick}>
			{children}
		</li>
	);
};

export default Menu;
