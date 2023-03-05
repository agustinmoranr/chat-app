import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import useGetPointerPosition from '../hooks/useGetPointerPosition';
import '../styles/Menu.css';

export const CLOSE_REASONS = {
	CLICK_OUTSIDE_MENU: 'clickOutside',
	SELECT_ITEM: 'selectItem',
};

export const Menu = ({
	children,
	open,
	onClose,
	keepMounted,
	transitionDuration = 200,
}) => {
	const menuRef = useRef(null);
	const [isMenuRendered, setIsMenuRendered] = useState(false);
	const [position, reset] = useGetPointerPosition();
	const mountMenu = open || keepMounted;

	useEffect(() => {
		if (open) {
			handleOpen();
			window.addEventListener('click', handleCloseMenu);
		}

		return () => {
			window.removeEventListener('click', handleCloseMenu);
		};
	}, [open]);

	useLayoutEffect(() => {
		if (isMenuRendered) {
			menuRef.current?.classList.add('show-menu');
		}
	}, [isMenuRendered]);

	function handleOpen() {
		setIsMenuRendered(true);
	}

	function onCloseMenu(reason) {
		menuRef.current?.addEventListener('transitionend', onEndTranstion);
		menuRef.current?.classList.remove('show-menu');
		function onEndTranstion() {
			onClose(reason);
			reset();
			setIsMenuRendered(false);
			menuRef.current?.removeEventListener('transitionend', onEndTranstion);
		}
	}

	function handleCloseMenu(event) {
		const clickingMenu = event.target.matches('.menu');
		const clickingMenuItem = event.target.matches('.menu-item');
		const shouldClose = open && !clickingMenu;
		let reason = null;
		if (clickingMenuItem) {
			reason = CLOSE_REASONS.SELECT_ITEM;
		}
		if (!clickingMenu && !clickingMenuItem) {
			reason = CLOSE_REASONS.CLICK_OUTSIDE_MENU;
		}
		if (shouldClose) {
			onCloseMenu(reason);
		}
	}

	return (
		mountMenu &&
		createPortal(
			<div
				ref={menuRef}
				className='menu'
				style={{
					transitionDuration: `${transitionDuration}ms`,
					top: position?.top,
					left: position?.left,
				}}>
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
