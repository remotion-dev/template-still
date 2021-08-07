import {Still} from 'remotion';
import {StillImage} from './HelloWorld';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Still
				id="PreviewCard"
				component={StillImage}
				width={1200}
				height={627}
				defaultProps={{
					title: 'Welcome to Remotion',
					description: 'Edit Video.tsx to change template',
					slogan: 'Write videos\nin React',
				}}
			/>
		</>
	);
};
