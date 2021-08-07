import React from 'react';
import {AbsoluteFill} from 'remotion';
import styled from 'styled-components';
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

const Description = styled.p`
	color: #61778a;
	font-size: 3.2em;
	margin: 0;
	margin-top: 20px;
	line-height: 1.3;
	font-weight: 500;
	max-width: 90%;
	max-lines: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
	box-orient: vertical;
`;

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
					<Description>{description}</Description>
					<div style={sloganStyle}>{slogan}</div>
				</div>
			</AbsoluteFill>
			<AbsoluteFill>
				<Swirl />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
