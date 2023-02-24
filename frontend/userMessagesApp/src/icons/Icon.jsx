import React from 'react';

const ICON_VARIANTS = {
	outlined: 'outlined',
	rounded: 'rounded',
	sharp: 'sharp',
};

const COLORS = {
	primary: 'var(--primary-color)',
	secondary: 'var(--secondary-color)',
	'text-primary': 'var(--text-primary-color)',
};

const setCssCustomProperty = (element, property, value) => {
	element.style.setProperty(property, value);
};

const Icon = ({ children, className, color, variant, ...props }) => {
	const iconRef = React.useRef(null);
	let _className = `material-symbols-${ICON_VARIANTS[variant]}`;
	_className = className ? `${_className} ${className}` : _className;

	React.useEffect(() => {
		setCssCustomProperty(iconRef?.current, 'color', COLORS[color]);
	}, [color]);

	return (
		<span ref={iconRef} className={_className} {...props}>
			{children}
		</span>
	);
};

Icon.defaultProps = {
	variant: ICON_VARIANTS.outlined,
	color: 'text-primary',
};

export default Icon;
