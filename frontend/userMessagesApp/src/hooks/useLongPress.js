/**
 * Retorna eventos touch y mouse para habilita funcionalidad longPress al dejar presionado un elemento por un {delay} determinado.
 *
 * usage:
 * const longPressEvent = useLongPress(onLongPress, onClick)
 * <button {...longPressEvent}>Botoncito</button>
 */

import { useCallback, useRef, useState } from 'react';

const useLongPress = (
	onLongPress,
	onClick,
	{ shouldPreventDefault = true, delay = 300 } = {},
) => {
	const [longPressTriggered, setLongPressTriggered] = useState(false);
	const timeout = useRef();
	const target = useRef();

	const start = useCallback(
		(event, ...args) => {
			if (shouldPreventDefault && event.target) {
				event.target.addEventListener('touchend', preventDefault, {
					passive: false,
				});
				target.current = event.target;
			}
			timeout.current = setTimeout(() => {
				onLongPress(event, ...args);
				setLongPressTriggered(true);
			}, delay);
		},
		[onLongPress, delay, shouldPreventDefault],
	);

	const clear = useCallback(
		(event, shouldTriggerClick = true) => {
			timeout.current && clearTimeout(timeout.current);
			shouldTriggerClick && !longPressTriggered && onClick();
			setLongPressTriggered(false);
			if (shouldPreventDefault && target.current) {
				target.current.removeEventListener('touchend', preventDefault);
			}
		},
		[shouldPreventDefault, onClick, longPressTriggered],
	);

	return {
		onMouseDown: (e, ...args) => start(e, ...args),
		onTouchStart: (e, ...args) => start(e, ...args),
		onMouseUp: (e) => clear(e),
		onMouseLeave: (e) => clear(e, false),
		onTouchEnd: (e) => clear(e),
	};
};

const isTouchEvent = (event) => {
	return 'touches' in event;
};

const preventDefault = (event) => {
	if (!isTouchEvent(event)) return;

	if (event.touches.length < 2 && event.preventDefault) {
		event.preventDefault();
	}
};

export default useLongPress;
