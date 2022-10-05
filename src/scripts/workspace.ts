import { FluoNode, INodeConnectionPointData } from "./node";
import { IO, IVector2, dist, drawLine } from "./utils";
import { type IStyle } from "../interfaces/workspace";

export enum StyleCategory {
	BACKGROUND,
	NODE,
	NODE_SELECTED,
	TEXT_TITLE,
	TEXT_LABEL_INPUT,
	TEXT_LABEL_OUTPUT,
	CONNECTION_POINT_INPUT_CONNECTED,
	CONNECTION_POINT_INPUT_DISCONNECTED,
	CONNECTION_POINT_OUTPUT_CONNECTED,
	CONNECTION_POINT_OUTPUT_DISCONNECTED,
	CONNECTION_LINE,
}

export enum CoarseDragTarget {
	NONE,
	BACKGROUND,
	NODE,
	CONNECTION,
}

export default class Workspace {
	public context: CanvasRenderingContext2D;
	public nodes: Array<FluoNode> = [];
	public currentDragType: CoarseDragTarget;
	public selectedNode: FluoNode;
	public selectedNodeOffset: IVector2;
	public style: IStyle;

	private currentConnectionPoint: INodeConnectionPointData;

	private lastTouchPosition: IVector2;

	constructor(ctx: CanvasRenderingContext2D, style: IStyle) {
		this.context = ctx;
		this.style = style;

		this.lastTouchPosition = { x: 0, y: 0 };

		this.registerEvents();
	}

	addNode(newNode: FluoNode) {
		this.nodes.push(newNode);
	}

	translateALlNodes(fn: Function) {
		this.nodes.forEach((node: FluoNode) => {
			node.translate(fn(node));
		});
	}

	getOverlappingNode(position: IVector2) {
		const arr = this.nodes.filter((node: FluoNode) => {
			return (
				position.x >= node.position.x &&
				position.x <= node.position.x + node.dimensions.x &&
				position.y >= node.position.y &&
				position.y <= node.position.y + node.dimensions.y
			);
		});
		return arr[arr.length - 1];
	}

	render() {
		this.clear();
		this.nodes.forEach((node: FluoNode) => {
			node.render();
		});
	}

	clear() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	overlappingConnectionPoint(
		nodes: Array<FluoNode>,
		event: MouseEvent
	): INodeConnectionPointData | null {
		let foundPoint: INodeConnectionPointData;
		nodes.forEach((node: FluoNode) => {
			node.connectionPoints.forEach((point: INodeConnectionPointData) => {
				if (
					Math.sqrt(
						(point.screenSpacePosition.x - event.clientX) ** 2 +
							(point.screenSpacePosition.y - event.clientY) ** 2
					) <
					this.style.node.inputs.connected.radius + node.style.node.inputs.connected.border.width
				) {
					foundPoint = point;
				}
			});
		});
		return foundPoint || null;
	}

	setContextWithStyleSettings(styleCategory: StyleCategory) {
		switch (styleCategory) {
			case StyleCategory.BACKGROUND:
				this.context.fillStyle = this.style.workspace.background.colour;
				break;

			case StyleCategory.NODE:
				this.context.fillStyle = this.style.node.background;
				this.context.strokeStyle = this.style.node.border.colour;
				this.context.lineWidth = this.style.node.border.width;
				break;

			case StyleCategory.NODE_SELECTED:
				this.context.fillStyle = this.style.node.backgroundSelected;
				this.context.strokeStyle = this.style.node.border.colour;
				this.context.lineWidth = this.style.node.border.width;
				break;

			case StyleCategory.TEXT_TITLE:
				this.context.fillStyle = this.style.node.title.colour;
				this.context.font = this.style.node.title.size + "px " + this.style.node.title.font;
				break;

			case StyleCategory.TEXT_LABEL_INPUT:
				this.context.fillStyle = this.style.node.inputs.labels.colour;
				this.context.font =
					this.style.node.inputs.labels.size + "px " + this.style.node.inputs.labels.font;
				break;

			case StyleCategory.TEXT_LABEL_OUTPUT:
				this.context.fillStyle = this.style.node.outputs.labels.colour;
				this.context.font =
					this.style.node.outputs.labels.size + "px " + this.style.node.outputs.labels.font;
				break;

			case StyleCategory.CONNECTION_POINT_INPUT_CONNECTED:
				this.context.fillStyle = this.style.node.inputs.connected.colour;
				this.context.strokeStyle = this.style.node.inputs.connected.border.colour;
				this.context.lineWidth = this.style.node.inputs.connected.border.width;
				break;

			case StyleCategory.CONNECTION_POINT_INPUT_DISCONNECTED:
				this.context.fillStyle = this.style.node.inputs.disconnected.colour;
				this.context.strokeStyle = this.style.node.inputs.disconnected.border.colour;
				this.context.lineWidth = this.style.node.inputs.disconnected.border.width;
				break;

			case StyleCategory.CONNECTION_POINT_OUTPUT_CONNECTED:
				this.context.fillStyle = this.style.node.outputs.connected.colour;
				this.context.strokeStyle = this.style.node.outputs.connected.border.colour;
				this.context.lineWidth = this.style.node.outputs.connected.border.width;
				break;

			case StyleCategory.CONNECTION_POINT_OUTPUT_DISCONNECTED:
				this.context.fillStyle = this.style.node.outputs.disconnected.colour;
				this.context.strokeStyle = this.style.node.outputs.disconnected.border.colour;
				this.context.lineWidth = this.style.node.outputs.disconnected.border.width;
				break;

			case StyleCategory.CONNECTION_LINE:
				this.context.strokeStyle = this.style.connectionLine.colour;
				this.context.lineWidth = this.style.connectionLine.width;
		}
	}

	registerEvents() {
		window.onload = () => {
			document.body.style.background = this.context.canvas.style.background;
		};

		document.addEventListener("mousedown", (event: MouseEvent) => {
			if (this.overlappingConnectionPoint(this.nodes, event)) {
				document.body.style.cursor = "normal";
			} else if (event.target === this.context.canvas) {
				document.body.style.cursor = "grabbing";
			}

			const overlapping = this.getOverlappingNode({
				x: event.clientX,
				y: event.clientY,
			});
			const overlappingConnectionPoint = this.overlappingConnectionPoint(this.nodes, event);

			if (overlappingConnectionPoint) {
				this.currentDragType = CoarseDragTarget.CONNECTION;
				this.currentConnectionPoint = overlappingConnectionPoint;
			} else if (overlapping) {
				this.currentDragType = CoarseDragTarget.NODE;
				this.selectedNode = overlapping;

				// Bring this node to the end of the workspace nodes array
				// so that it renders on top of the other nodes
				this.nodes.push(this.nodes.splice(this.nodes.indexOf(overlapping), 1)[0]);
				this.selectedNodeOffset = {
					x: event.clientX - overlapping.position.x,
					y: event.clientY - overlapping.position.y,
				};
				overlapping.beingDragged = true;
			} else {
				this.currentDragType = CoarseDragTarget.BACKGROUND;
			}

			this.render();
		});
		document.addEventListener("mousemove", (event: MouseEvent) => {
			this.render();

			if (
				this.overlappingConnectionPoint(this.nodes, event) &&
				this.currentDragType !== CoarseDragTarget.NODE
			) {
				document.body.style.cursor = "pointer";
			} else if (event.target === this.context.canvas && event.buttons === 1) {
			} else if (event.target === this.context.canvas) {
				document.body.style.cursor = "grab";
			}

			if (event.target === this.context.canvas) {
				if (event.buttons === 1) {
					switch (this.currentDragType) {
						case CoarseDragTarget.CONNECTION:
							// Draw line between current connection point and mouse cursor.
							drawLine(
								this.currentConnectionPoint.screenSpacePosition,
								{
									x: event.clientX,
									y: event.clientY,
								},
								this.currentConnectionPoint,
								this
							);
							break;

						case CoarseDragTarget.NODE:
							this.selectedNode.position.x = event.offsetX - this.selectedNodeOffset.x;
							this.selectedNode.position.y = event.offsetY - this.selectedNodeOffset.y;
							break;

						case CoarseDragTarget.BACKGROUND:
							this.translateALlNodes((node: FluoNode) => {
								return {
									x: event.movementX,
									y: event.movementY,
								};
							});
							break;
					}
				}
			}
		});
		document.addEventListener("mouseup", (event: MouseEvent) => {
			if (this.currentDragType === CoarseDragTarget.CONNECTION) {
				const overlapping = this.overlappingConnectionPoint(this.nodes, event);
				if (overlapping) {
					if (overlapping.io !== this.currentConnectionPoint.io) {
						/* Node connections are one to many,
						so each input should have exactly one connection.
						Hence, the inputs should hold the connection data. */

						const outputConnection =
							overlapping.io === IO.OUTPUT ? overlapping : this.currentConnectionPoint;

						const inputConnection =
							this.currentConnectionPoint.io === IO.INPUT
								? this.currentConnectionPoint
								: overlapping;

						inputConnection.connectedTo = outputConnection;
						console.info(outputConnection);
						console.info(outputConnection.connectedTo);
					}
				}
			}

			// Reset stuff
			if (event.target === this.context.canvas) document.body.style.cursor = "grab";
			if (this.selectedNode) this.selectedNode.beingDragged = false;
			this.selectedNode = null;
			this.currentDragType = CoarseDragTarget.NONE;
			this.currentConnectionPoint = null;

			this.render();
		});

		window.onresize = () => {
			this.context.canvas.height = window.innerHeight;
			this.context.canvas.width = window.innerWidth;
			this.render();
		};
	}
}
