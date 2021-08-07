import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Swirl} from './Swirl';

const absContainer: React.CSSProperties = {
	backgroundColor: 'white',
};

const container: React.CSSProperties = {
	flex: 1,
	padding: 100,
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const titleStyle: React.CSSProperties = {
	fontSize: '5.5em',
	marginTop: 0,
	fontWeight: 700,
	marginBottom: 0,
};

const descriptionStyle: React.CSSProperties = {
	color: '#e1edf7',
	fontSize: '3.2em',
	margin: 0,
	marginTop: 20,
	lineHeight: 1.3,
	fontWeight: 500,
	maxWidth: '90%',
	maxLines: 2,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	lineClamp: 2,
};

const gradientText: React.CSSProperties = {
	background: 'linear-gradient(to right, black, #666)',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent',
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
};

const sloganStyle: React.CSSProperties = {
	position: 'absolute',
	bottom: 58,
	right: 100,
	fontSize: 36,
	lineHeight: 1.1,
	fontWeight: 700,
	textAlign: 'right',
	whiteSpace: 'pre',
};

export const StillImage: React.FC<{
	title: string;
	description: string;
	slogan: string;
}> = ({title, description, slogan}) => {
	return (
		<AbsoluteFill style={absContainer}>
			<AbsoluteFill>
				<div style={container}>
					<div style={titleStyle}>
						<span style={gradientText}>{title}</span>
					</div>
					<p style={descriptionStyle}>{description}</p>
					<div style={sloganStyle}>{slogan}</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill>
				<Swirl />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
