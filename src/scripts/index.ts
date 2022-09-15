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

document.addEventListener("mousemove", (event: MouseEvent) => {
	if (event.target === canvas) {
		if (event.buttons === 1) {
			if (workspace.currentDragType === ICoarseDragTarget.NODE) {
				workspace.selectedNode.position.x =
					event.offsetX - workspace.selectedNodeOffset.x;
				workspace.selectedNode.position.y =
					event.offsetY - workspace.selectedNodeOffset.y;
			} else {
				workspace.translateALlNodes({
					x: event.movementX,
					y: event.movementY,
				});
			}
		}
	}
});

function update() {
	requestAnimationFrame(update);

	workspace.clear();
	workspace.render();
}
update();

document.addEventListener("mousedown", (event: MouseEvent) => {
	if (event.target === canvas) {
		document.body.style.cursor = "grabbing";
	}

	const overlapping = workspace.getOverlappingNode({
		x: event.clientX,
		y: event.clientY,
	});
	console.log(overlapping?.position);

	if (overlapping) {
		workspace.currentDragType = ICoarseDragTarget.NODE;
		workspace.selectedNode = overlapping;
		workspace.nodes.push(
			workspace.nodes.splice(workspace.nodes.indexOf(overlapping), 1)[0]
		);
		workspace.selectedNodeOffset = {
			x: event.clientX - overlapping.position.x,
			y: event.clientY - overlapping.position.y,
		};
		overlapping.style.fillColour = "#334155";

		// Bring this node to the end of the workspace nodes array
		// so that it renders on top of the other nodes
	} else {
		workspace.currentDragType = ICoarseDragTarget.BACKGROUND;
	}
});
document.addEventListener("mouseup", (event: MouseEvent) => {
	if (event.target === canvas) {
		document.body.style.cursor = "grab";
	}
	if (workspace.selectedNode)
		workspace.selectedNode.style.fillColour = "#1e293b";
	workspace.selectedNode = null;

	workspace.currentDragType = ICoarseDragTarget.NONE;
});
