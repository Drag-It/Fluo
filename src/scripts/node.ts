import Workspace from "./workspace";
import { IVector2 } from "./utils";

//#region Public interfaces
export interface INodeIO {
	name: string;
	type: any;
}
export interface INodeParams {
	inputs: Array<INodeIO>;
	outputs: Array<INodeIO>;
}
export interface INodeStyle {
	fillColour?: string;
	strokeColour?: string;
	inputFillColour?: string;
	inputStrokeColour?: string;
	width?: number;
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

export class FluoNode {
	//#region Fields
	name: string;
	params: INodeParams;
	workspace: Workspace;
	context: CanvasRenderingContext2D;
	position: IVector2;
	style: INodeStyle;

	dimensions: IVector2;
	//#endregion
	constructor(
		name: string,
		params: INodeParams,
		workspace: Workspace,
		ctx: CanvasRenderingContext2D,
		position: IVector2,
		nodeStyle: INodeStyle
	) {
		this.name = name;
		this.params = params;
		this.workspace = workspace;
		// Deep copy these props so the original references are not mutated when accessed.
		this.position = JSON.parse(JSON.stringify(position));
		this.context = ctx;
		this.style = JSON.parse(JSON.stringify(nodeStyle));

		this.dimensions = {
			x: this.style.width,
			y: this.calculateNodeHeight(),
		};

		workspace.addNode(this);
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

	private calculateNodeHeight() {
		return (
			this.style.padding * 2 +
			this.style.titleFontSize +
			this.style.titleToConnectionPointsPadding +
			(this.style.connectionPointRadius * 2 >
			this.style.connectionPointLabelFontSize
				? this.style.connectionPointRadius * 2
				: this.style.connectionPointLabelFontSize) +
			(this.params.inputs.length >= 2
				? (this.params.inputs.length - 1) *
				  this.style.interInputConnectionPadding
				: 0)
		);
	}

	private drawNode() {
		this.setContextWithStyleSettings();

		//#region Draw the node body
		const nodeHeight = this.calculateNodeHeight();
		this.dimensions.y = nodeHeight;

		this.context.beginPath();
		this.context.rect(
			this.position.x,
			this.position.y,
			this.style.width,
			nodeHeight
		);
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

		//#region Node Title
		this.context.fill();
		this.context.stroke();
		this.context.fillStyle = this.style.fontColour;
		this.context.font = this.style.titleFontSize + "px Monospace";
		this.context.fillText(
			this.name,
			this.position.x + this.style.padding,
			this.position.y + this.style.titleFontSize / 1.2 + this.style.padding
		);
		//#endregion2
	}

	translate(newPositionDelta: IVector2) {
		this.position.x += newPositionDelta.x;
		this.position.y += newPositionDelta.y;
	}

	render() {
		this.setContextWithStyleSettings();
		this.drawNode();
	}

	isOverlapping(position: IVector2) {
		return (
			position.x > this.position.x &&
			position.x < this.position.x + this.dimensions.x &&
			position.y > this.position.y &&
			position.y < this.position.y + this.dimensions.y
		);
	}
	//#endregion
}
