import { FluoNode } from "./node";
import Workspace from "./workspace";
import style from "../styles/style";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const workspace = new Workspace(ctx, style);

new FluoNode(
	"On Start",
	{
		inputs: [],
		outputs: [{ name: "Output", type: Number }],
	},
	workspace,
	ctx,
	{ x: 700, y: 200 },
	style
);

new FluoNode(
	"Write data",
	{
		inputs: [{ name: "Input", type: Number }],
		outputs: [],
	},
	workspace,
	ctx,
	{ x: 100, y: 50 },
	style
);

new FluoNode(
	"Read data",
	{
		inputs: [{ name: "Input", type: Number }],
		outputs: [],
	},
	workspace,
	ctx,
	{ x: 500, y: 200 },
	style
);

new FluoNode(
	"Add",
	{
		inputs: [
			{ name: "A", type: Number },
			{ name: "B", type: Number },
		],
		outputs: [{ name: "Sum", type: Number }],
	},
	workspace,
	ctx,
	{ x: 800, y: 300 },
	style
);
