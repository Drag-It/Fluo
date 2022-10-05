import { FluoNode } from "./node";
import Workspace from "./workspace";
import style from "../styles/style";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const workspace = new Workspace(ctx, style);

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
		outputs: [{ name: "argggg4", type: String }],
	},
	workspace,
	ctx,
	{ x: 500, y: 200 },
	style
);
