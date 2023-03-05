import { useRef, useCallback } from 'react';
import useEventListeners from './useEventListeners';

const useGetPointerPosition = (initialValue = null) => {
	const position = useRef(initialValue);
	useEventListeners(['mousemove', 'touchstart'], getPointer);

	function getPointer(event) {
		const pointerCoordinates = {
			top: event.pageY || event.touches[0]?.pageY,
			left: event.pageX || event.touches[0]?.pageX,
		};
		position.current = pointerCoordinates;
	}

	const reset = useCallback(() => (position.current = null), []);

	return [position.current, reset];
};

export default useGetPointerPosition;
