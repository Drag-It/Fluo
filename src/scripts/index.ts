import { FluoNode, INodeStyle } from "./node";
import Workspace from "./workspace";

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const style: INodeStyle = {
	fillColour: "#1e293b",
	strokeColour: "#334155",
	strokeWidth: 2,
};

const workspace = new Workspace(ctx);

const node = new FluoNode(
	workspace,
	ctx,
	{ x: 100, y: 200 },
	{ width: 200, height: 100 },
	style
);

const node2 = new FluoNode(
	workspace,
	ctx,
	{ x: 100, y: 50 },
	{ width: 200, height: 100 },
	style
);

document.addEventListener("mousemove", (event: MouseEvent) => {
	if (event.buttons === 1) {
		workspace.changeAllNodePositions({
			x: event.movementX,
			y: event.movementY,
		});
	}
});

function update() {
	requestAnimationFrame(update);

	workspace.clear();

	// workspace.changeAllNodePositions({ x: 0.2, y: 0 });
	workspace.render();
}
update();
