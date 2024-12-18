export type VisualizationType = 'color' | 'image';

export type Result = { type: 'error'; message: string } | { type: 'success' };

export type Option = {
	name: string;
	type: VisualizationType;
	display: string;
	value: string;
};

export type Presentation = {
	type?: 'carousel' | 'grid';
	width?: string;
	columns?: number;
};

export type Collection = {
	extends?: string[];
	options?: Option[];
};
