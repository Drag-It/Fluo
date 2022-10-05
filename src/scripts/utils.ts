import { INodeConnectionPointData } from "./node";
import Workspace, { StyleCategory } from "./workspace";

interface IVector2 {
	x: number;
	y: number;
}
interface IVector3 {
	x: number;
	y: number;
	z: number;
}

function dist(first: IVector2, second: IVector2) {
	return Math.sqrt((second.x - first.x) ** 2 + (second.y - first.y) ** 2);
}

function fact(x) {
	return x == 0 ? 1 : x * fact(x - 1);
}

function canvasText(position: IVector2, textContent: string) {}

enum IO {
	INPUT,
	OUTPUT,
}

function drawLine(
	start: IVector2,
	end: IVector2,
	currentPoint: INodeConnectionPointData,
	workspace: Workspace
) {
	const directionMultiplier = currentPoint.io === IO.INPUT ? -1 : 1;
	const bezierOffset =
		dist(start, end) * workspace.style.connectionLine.curviness * directionMultiplier;

	workspace.setContextWithStyleSettings(StyleCategory.CONNECTION_LINE);

	workspace.context.beginPath();
	workspace.context.moveTo(start.x, start.y);
	workspace.context.bezierCurveTo(
		start.x + bezierOffset,
		start.y,
		end.x - bezierOffset,
		end.y,
		end.x,
		end.y
	);
	workspace.context.stroke();
}

export { IVector2, IVector3, dist, fact, canvasText, IO, drawLine };
