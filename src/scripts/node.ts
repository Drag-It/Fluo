import Workspace, { StyleCategory } from "./workspace";
import { type IVector2, IO, drawLine } from "./utils";

import { type IStyle } from "../interfaces/workspace";

//#region Public interfaces
export interface INodeIO {
	name: string;
	type: any;
}
export interface INodeParams {
	inputs: Array<INodeIO>;
	outputs: Array<INodeIO>;
}

export interface INodeConnectionPointData {
	screenSpacePosition: IVector2 | null;
	io: IO;
	type: any;
	connectedTo: INodeConnectionPointData | null;
}
//#endregion

export class FluoNode {
	//#region Fields
	name: string;
	params: INodeParams;
	workspace: Workspace;
	context: CanvasRenderingContext2D;
	position: IVector2;
	style: IStyle;
	connectionPoints: INodeConnectionPointData[];
	dimensions: IVector2;

	beingDragged: boolean;

	//#endregion
	constructor(
		name: string,
		params: INodeParams,
		workspace: Workspace,
		ctx: CanvasRenderingContext2D,
		position: IVector2,
		nodeStyle: IStyle
	) {
		this.name = name;
		this.params = params;
		this.workspace = workspace;
		this.context = ctx;

		// Deep copy these props so the original references are not mutated when accessed.
		this.position = JSON.parse(JSON.stringify(position));
		this.style = JSON.parse(JSON.stringify(nodeStyle));

		this.connectionPoints = [];
		Object.keys(this.params).forEach((ioGroup: string) => {
			this.params[ioGroup].forEach(() => {
				this.connectionPoints.push({
					screenSpacePosition: null,
					io: ioGroup === "inputs" ? IO.INPUT : IO.OUTPUT,
					type: Number,
					connectedTo: null,
				});
			});
		});

		this.dimensions = {
			x: this.style.node.width,
			y: this.calculateNodeHeight(),
		};

		workspace.addNode(this);
		workspace.setContextWithStyleSettings(StyleCategory.NODE);
		this.drawNode();
	}

	//#region Methods
	private calculateNodeHeight() {
		/* TODO: Calculate based on current node properties;
		don't just assume all connection points are inputs and connected. */
		return (
			this.style.node.padding * 2 +
			this.style.node.title.size +
			this.style.node.inputs.titleToConnectionPointsPadding +
			(this.style.node.inputs.connected.radius * 2 > this.style.node.inputs.labels.size
				? this.style.node.inputs.connected.radius * 2
				: this.style.node.inputs.labels.size) +
			(this.params.inputs.length >= 2
				? (this.params.inputs.length - 1) * this.style.node.inputs.interPadding
				: 0)
		);
	}

	drawNode() {
		//#region Draw the node body
		const nodeHeight = this.calculateNodeHeight();
		this.dimensions.y = nodeHeight;

		this.beingDragged
			? this.workspace.setContextWithStyleSettings(StyleCategory.NODE_SELECTED)
			: this.workspace.setContextWithStyleSettings(StyleCategory.NODE);
		this.context.beginPath();
		this.context.rect(this.position.x, this.position.y, this.style.node.width, nodeHeight);
		this.context.fill();
		this.context.stroke();
		//#endregion

		//#region Node Title
		this.workspace.setContextWithStyleSettings(StyleCategory.TEXT_TITLE);
		this.context.beginPath();
		this.context.fillText(
			this.name,
			this.position.x + this.style.node.padding,
			this.position.y + this.style.node.title.size / 1.2 + this.style.node.padding
		);
		this.context.fill();
		//#endregion

		//#region Draw the connection points
		Object.keys(this.params).forEach((ioGroup: string) => {
			const io = ioGroup === "inputs" ? IO.INPUT : IO.OUTPUT;
			this.params[ioGroup].forEach((point: INodeIO, index: number) => {
				//TODO: Style differently based on connection state.

				io === IO.INPUT
					? this.workspace.setContextWithStyleSettings(
							StyleCategory.CONNECTION_POINT_INPUT_CONNECTED
					  )
					: this.workspace.setContextWithStyleSettings(
							StyleCategory.CONNECTION_POINT_OUTPUT_CONNECTED
					  );

				const yLevel =
					this.position.y +
					this.style.node.padding +
					this.style.node.title.size +
					this.style.node.inputs.titleToConnectionPointsPadding +
					index * this.style.node.inputs.interPadding +
					this.style.node.inputs.connected.radius;

				const pointPosX =
					io === IO.INPUT
						? this.position.x + this.style.node.padding + this.style.node.inputs.connected.radius
						: this.position.x +
						  this.dimensions.x -
						  this.style.node.padding -
						  this.style.node.inputs.connected.radius;

				// Assign position to each connection point so intersections can be checked later.
				this.connectionPoints[
					index + (io === IO.OUTPUT ? this.params.inputs.length : 0)
				].screenSpacePosition = {
					x: pointPosX,
					y: yLevel,
				};

				//#region Circle
				this.context.beginPath();
				this.context.arc(
					pointPosX,
					yLevel,
					this.style.node.inputs.connected.radius,
					0,
					2 * Math.PI,
					false
				);
				this.context.fill();
				this.context.stroke();
				//#endregion

				//#region Connection point label
				const labelPosX =
					io === IO.INPUT
						? this.position.x +
						  this.style.node.padding +
						  this.style.node.inputs.connected.radius * 2 +
						  this.style.node.inputs.pointToLabelPadding
						: this.position.x +
						  this.dimensions.x -
						  this.style.node.padding -
						  this.style.node.inputs.connected.radius * 2 -
						  this.style.node.inputs.pointToLabelPadding -
						  point.name.length * (this.style.node.inputs.labels.size / 1.6);
				/* TODO: quantify this magic 1.6. I think the
				letters are 1.6 times taller than they are wide?
				Seems about right.
				Calculate accurately and insert accordingly. */

				io === IO.INPUT
					? this.workspace.setContextWithStyleSettings(StyleCategory.TEXT_LABEL_INPUT)
					: this.workspace.setContextWithStyleSettings(StyleCategory.TEXT_LABEL_OUTPUT);

				this.context.beginPath();
				this.context.fillText(
					point.name,
					labelPosX,
					yLevel + this.style.node.inputs.labels.size / 4 // TODO: What is this 4 doing?
				);
				this.context.fill();
				this.context.stroke();
				//#endregion
			});
		});
		//#endregion
	}

	drawConnectionLine() {
		this.params.inputs.forEach((_: INodeIO, index: number) => {
			const p = this.connectionPoints[index];

			if (p.connectedTo) {
				const gradient = this.context.createLinearGradient(
					p.screenSpacePosition.x,
					p.screenSpacePosition.y,
					p.connectedTo.screenSpacePosition.x,
					p.connectedTo.screenSpacePosition.y
				);
				gradient.addColorStop(0, this.style.node.inputs.connected.colour);
				gradient.addColorStop(1, this.style.node.outputs.connected.colour);
				this.context.strokeStyle = gradient;

				if (p.connectedTo) {
					drawLine(p.screenSpacePosition, p.connectedTo.screenSpacePosition, p, this.workspace);
				}
			}
		});
	}

	translate(newPositionDelta: IVector2) {
		this.position.x += newPositionDelta.x;
		this.position.y += newPositionDelta.y;
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
