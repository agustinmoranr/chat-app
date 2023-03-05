import { useEffect, useRef } from 'react';

export default function useEventListeners(
	eventTypes = [''],
	callback,
	element = window,
	eventsOptions,
) {
	const callbackRef = useRef(callback);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (element == null) return;
		const _eventTypes =
			typeof eventTypes === 'string' ? [eventTypes] : eventTypes;
		const handler = (e) => callbackRef.current(e);

		_eventTypes.forEach((type) => {
			element.addEventListener(type, handler, eventsOptions);
		});

		return () => {
			_eventTypes.forEach((type) => {
				element.removeEventListener(type, handler, eventsOptions);
			});
		};
	}, [eventTypes, element, eventsOptions]);
}
