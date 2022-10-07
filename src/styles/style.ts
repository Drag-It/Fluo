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
			flowControlPadding: 10,
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
				flowControl: {
					size: 12,
					colour: "#94a3b8",
				},
			},
			disconnected: {
				radius: 4,
				colour: "#22c55e",
				border: {
					width: 2,
					colour: "#166534",
				},
				flowControl: {
					size: 12,
					colour: "#94a3b8",
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
				flowControl: {
					size: 12,
					colour: "#94a3b8",
				},
			},
			disconnected: {
				radius: 3,
				colour: "#d946ef",
				border: {
					width: 2,
					colour: "#86198f",
				},
				flowControl: {
					size: 12,
					colour: "#94a3b8",
				},
			},
		},
		width: 200,
	},
	connectionLine: {
		curviness: 0.5,
		width: 3,
	},
};

export default style;
