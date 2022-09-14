import Workspace from "./workspace";

//#region Public interfaces
export interface INodeIO {
	name: string;
	type: any;
}
export interface INodeParams {
	inputs: Array<INodeIO>;
	outputs: Array<INodeIO>;
}
export interface INodePosition {
	x: number;
	y: number;
}
export interface INodeStyle {
	fillColour?: string;
	strokeColour?: string;
	inputFillColour?: string;
	inputStrokeColour?: string;
	strokeWidth?: number;
	titleFontSize?: number;
	fontColour?: string;
	padding?: number;
	titleToConnectionPointsPadding?: number;
	connectionPointRadius?: number;
	interInputConnectionPadding?: number;
	connectionPointToLabelPadding?: number;
	connectionPointLabelFontSize?: number;
}
//#endregion
//#region Private interfaces
interface INodeDimensions {
	width: number;
	height: number;
}
//#endregion

export class FluoNode {
	//#region Fields
	params: INodeParams;
	context: CanvasRenderingContext2D;
	position: INodePosition;
	style: INodeStyle;

	private dimensions: INodeDimensions;
	//#endregion
	constructor(
		params: INodeParams,
		workspace: Workspace,
		ctx: CanvasRenderingContext2D,
		position: INodePosition,
		nodeStyle: INodeStyle
	) {
		workspace.addNode(this);
		this.params = params;
		// Deep copy these props so the original references are not mutated when accessed.
		this.position = JSON.parse(JSON.stringify(position));
		this.context = ctx;
		this.style = JSON.parse(JSON.stringify(nodeStyle));

		this.setContextWithStyleSettings();
		this.drawNode();
	}

	//#region Methods
	private setContextWithStyleSettings() {
		this.context.fillStyle = this.style.fillColour;
		this.context.strokeStyle = this.style.strokeColour;
		this.context.lineWidth = this.style.strokeWidth;
		this.context.font = this.style.titleFontSize + "px Monospace";
	}

	private drawNode() {
		this.setContextWithStyleSettings();

		//#region Draw the node body
		const nodeHeight =
			this.style.padding * 2 +
			this.style.titleFontSize +
			this.style.titleToConnectionPointsPadding +
			this.params.inputs.length * this.style.connectionPointRadius * 2 +
			(this.params.inputs.length >= 2
				? this.params.inputs.length - 1 * this.style.interInputConnectionPadding
				: 0);
		this.context.beginPath();
		this.context.rect(this.position.x, this.position.y, 200, nodeHeight);
		this.context.fill();
		this.context.stroke();
		//#endregion
		this.context.fillStyle = this.style.inputFillColour;
		this.context.strokeStyle = this.style.inputStrokeColour;

		//#region Draw the input connection points
		this.params.inputs.forEach((input: INodeIO, index: number) => {
			const yLevel =
				this.position.y +
				this.style.padding +
				this.style.titleFontSize +
				this.style.titleToConnectionPointsPadding +
				index * this.style.interInputConnectionPadding +
				this.style.connectionPointRadius;
			// Circle
			this.context.beginPath();
			this.context.arc(
				this.position.x + this.style.padding + this.style.connectionPointRadius,
				yLevel,
				this.style.connectionPointRadius,
				0,
				2 * Math.PI,
				false
			);
			this.context.fill();
			this.context.stroke();

			// Label
			this.context.font =
				this.style.connectionPointLabelFontSize + "px Monospace";
			this.context.fillText(
				input.name,
				this.position.x +
					this.style.padding +
					this.style.connectionPointRadius * 2 +
					this.style.connectionPointToLabelPadding,
				yLevel + this.style.connectionPointLabelFontSize / 4
			);
			this.context.fill();
			this.context.stroke();
		});

		//#endregion

		this.context.fill();
		this.context.stroke();
		this.context.fillStyle = this.style.fontColour;
		this.context.font = this.style.titleFontSize + "px Monospace";
		this.context.fillText(
			"Node",
			this.position.x + this.style.padding,
			this.position.y + this.style.titleFontSize / 1.2 + this.style.padding
		);
	}

	translate(newPositionDelta: INodePosition) {
		this.position.x += newPositionDelta.x;
		this.position.y += newPositionDelta.y;
	}

	render() {
		this.setContextWithStyleSettings();
		this.drawNode();
	}

	isOverlapping(position: INodePosition) {
		return (
			position.x > this.position.x &&
			position.x < this.position.x + this.dimensions.width &&
			position.y > this.position.y &&
			position.y < this.position.y + this.dimensions.height
		);
	}
	//#endregion
}
