import Workspace from "./workspace";

export interface INodePosition {
	x: number;
	y: number;
}
export interface INodeDimensions {
	width: number;
	height: number;
}
export interface INodeStyle {
	fillColour: string;
	strokeColour: string;
	strokeWidth: number;
}

export class FluoNode {
	context: CanvasRenderingContext2D;
	position: INodePosition;
	dimensions: INodeDimensions;
	style: INodeStyle;

	private setContextWithStyleSettings() {
		this.context.fillStyle = this.style.fillColour;
		this.context.strokeStyle = this.style.strokeColour;
		this.context.lineWidth = this.style.strokeWidth;
	}
	private drawNode() {
		this.context.beginPath();
		this.context.rect(
			this.position.x,
			this.position.y,
			this.dimensions.width,
			this.dimensions.height
		);
		this.context.fill();
		this.context.stroke();
	}

	constructor(
		workspace: Workspace,
		ctx: CanvasRenderingContext2D,
		position: INodePosition,
		dimensions: INodeDimensions,
		nodeStyle: INodeStyle
	) {
		workspace.addNode(this);
		this.position = position;
		this.dimensions = dimensions;
		this.context = ctx;
		this.style = nodeStyle;

		this.setContextWithStyleSettings();
		this.drawNode();
	}

	translate(newPositionDelta: INodePosition) {
		this.position.x += newPositionDelta.x;
		this.position.y += newPositionDelta.y;
	}

	render() {
		this.drawNode();
		this.setContextWithStyleSettings();
	}

	isOverlapping(position: INodePosition) {
		return (
			position.x > this.position.x &&
			position.x < this.position.x + this.dimensions.width &&
			position.y > this.position.y &&
			position.y < this.position.y + this.dimensions.height
		);
	}
}
