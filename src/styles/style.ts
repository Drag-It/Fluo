import { type IStyle } from "../interfaces/workspace";

const style: IStyle = {
	workspace: {
		background: {
			colour: "#0f172a",
		},
	},
	node: {
		background: "#1e293b",
		backgroundSelected: "#334155",
		border: {
			width: 2,
			colour: "#334155",
		},
		padding: 5,
		title: {
			font: "Monospace",
			size: 20,
			colour: "#94a3b8",
		},
		inputs: {
			titleToConnectionPointsPadding: 15,
			interPadding: 32,
			pointToLabelPadding: 12,
			labels: {
				font: "Monospace",
				size: 14,
				colour: "#22c55e",
			},
			connected: {
				radius: 4,
				colour: "#22c55e",
				border: {
					width: 2,
					colour: "#166534",
				},
			},
			disconnected: {
				radius: 4,
				colour: "#22c55e",
				border: {
					width: 2,
					colour: "#166534",
				},
			},
		},
		outputs: {
			titleToConnectionPointsPadding: 15,
			interPadding: 32,
			pointToLabelPadding: 12,
			labels: {
				font: "Monospace",
				size: 14,
				colour: "#d946ef",
			},
			connected: {
				radius: 3,
				colour: "#d946ef",
				border: {
					width: 2,
					colour: "#86198f",
				},
			},
			disconnected: {
				radius: 3,
				colour: "#d946ef",
				border: {
					width: 2,
					colour: "#86198f",
				},
			},
		},
		width: 200,
	},
	connectionLine: {
		width: 3,
		colour: "#ef4444",
		curviness: 0.5,
	},
};

export default style;
