import { FluoNode, INodeStyle } from "./node";
import Workspace, { ICoarseDragTarget } from "./workspace";

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
	if (event.target === canvas) {
		if (event.buttons === 1) {
			if (workspace.currentDragType === ICoarseDragTarget.NODE) {
				workspace
					.getOverlappingNode({
						x: event.clientX,
						y: event.clientY,
					})
					.translate({
						x: event.movementX,
						y: event.movementY,
					});
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

	// workspace.translateALlNodes({ x: 0.2, y: 0 });

	workspace.render();
}
update();

document.addEventListener("mousedown", (event: MouseEvent) => {
	if (event.target === canvas) {
		document.body.style.cursor = "grabbing";
	}

	if (
		workspace.getOverlappingNode({
			x: event.clientX,
			y: event.clientY,
		})
	) {
		workspace.currentDragType = ICoarseDragTarget.NODE;
	} else {
		workspace.currentDragType = ICoarseDragTarget.BACKGROUND;
	}
});
document.addEventListener("mouseup", (event: MouseEvent) => {
	if (event.target === canvas) {
		document.body.style.cursor = "grab";
	}

	workspace.currentDragType = ICoarseDragTarget.NONE;
});
