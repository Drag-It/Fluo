import { FluoNode, INodeStyle } from "./node";
import Workspace, { ICoarseDragTarget } from "./workspace";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const style: INodeStyle = {
	fillColour: "#1e293b",
	strokeColour: "#334155",
	inputFillColour: "#22c55e",
	inputStrokeColour: "#166534",
	width: 200,
	strokeWidth: 2,
	titleFontSize: 20,
	fontColour: "#94a3b8",
	padding: 5,
	titleToConnectionPointsPadding: 15,
	connectionPointRadius: 4,
	interInputConnectionPadding: 32,
	connectionPointToLabelPadding: 12,
	connectionPointLabelFontSize: 14,
};

const workspace = new Workspace(ctx);

const node = new FluoNode(
	"Node 1",
	{
		inputs: [
			{ name: "arg1", type: Number },
			{ name: "arg2", type: Number },
			// { name: "arg3", type: Number },
			// { name: "arg4", type: Number },
		],
		outputs: [{ name: "arg2", type: Number }],
	},
	workspace,
	ctx,
	{ x: 700, y: 200 },
	style
);

const node2 = new FluoNode(
	"Node 2",
	{
		inputs: [{ name: "arg3", type: String }],
		outputs: [{ name: "arg4", type: String }],
	},
	workspace,
	ctx,
	{ x: 100, y: 50 },
	style
);

const node3 = new FluoNode(
	"Node 3",
	{
		inputs: [
			{ name: "arg1", type: Number },
			{ name: "arg2", type: Number },
			{ name: "arg3", type: Number },
			{ name: "arg4", type: Number },
		],
		outputs: [{ name: "arg4", type: String }],
	},
	workspace,
	ctx,
	{ x: 500, y: 200 },
	style
);
