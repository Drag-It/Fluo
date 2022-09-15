import { FluoNode } from "./node";
import { IVector2 } from "./utils";

export enum ICoarseDragTarget {
	NONE,
	BACKGROUND,
	NODE,
}

export default class Workspace {
	public context: CanvasRenderingContext2D;
	public nodes: Array<FluoNode> = [];
	public currentDragType: ICoarseDragTarget;
	public selectedNode: FluoNode;
	public selectedNodeOffset: IVector2;

	scale: number;

	constructor(ctx: CanvasRenderingContext2D) {
		this.context = ctx;
		this.scale = 1;

		this.registerEvents();
	}

	// Scale
	private s(value: number) {
		return value * this.scale;
	}
	// Scale inverse
	private si(value: number) {
		return value / this.scale;
	}

	addNode(newNode: FluoNode) {
		this.nodes.push(newNode);
	}

	translateALlNodes(newPositionDelta: IVector2) {
		this.nodes.forEach((node: FluoNode) => {
			node.translate(newPositionDelta);
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
		this.context.clearRect(
			0,
			0,
			this.context.canvas.width,
			this.context.canvas.height
		);
	}

	registerEvents() {
		document.addEventListener("mousedown", (event: MouseEvent) => {
			if (event.target === this.context.canvas) {
				document.body.style.cursor = "grabbing";
			}

			const overlapping = this.getOverlappingNode({
				x: this.si(event.clientX),
				y: this.si(event.clientY),
			});

			if (overlapping) {
				this.currentDragType = ICoarseDragTarget.NODE;
				this.selectedNode = overlapping;
				this.nodes.push(
					this.nodes.splice(this.nodes.indexOf(overlapping), 1)[0]
				);
				this.selectedNodeOffset = {
					x: event.clientX - this.s(overlapping.position.x),
					y: event.clientY - this.s(overlapping.position.y),
				};
				overlapping.style.fillColour = "#334155";

				// Bring this node to the end of the workspace nodes array
				// so that it renders on top of the other nodes
			} else {
				this.currentDragType = ICoarseDragTarget.BACKGROUND;
			}
		});
		document.addEventListener("mouseup", (event: MouseEvent) => {
			if (event.target === this.context.canvas) {
				document.body.style.cursor = "grab";
			}
			if (this.selectedNode) this.selectedNode.style.fillColour = "#1e293b";
			this.selectedNode = null;

			this.currentDragType = ICoarseDragTarget.NONE;
		});
		document.addEventListener("mousemove", (event: MouseEvent) => {
			if (event.target === this.context.canvas) {
				if (event.buttons === 1) {
					if (this.currentDragType === ICoarseDragTarget.NODE) {
						this.selectedNode.position.x =
							this.si(event.offsetX) - this.si(this.selectedNodeOffset.x);
						this.selectedNode.position.y =
							this.si(event.offsetY) - this.si(this.selectedNodeOffset.y);
					} else {
						this.translateALlNodes({
							x: this.si(event.movementX),
							y: this.si(event.movementY),
						});
					}
				}
			}
		});
		document.addEventListener("wheel", (event) => {
			console.info(event);
			if (event.deltaY == 0) return;
			else if (event.deltaY < 0) {
				if (this.scale > 0.1) {
					this.scale /= event.deltaY / -100;
					// TODO: Translate all nodes on scroll
				} else {
					this.scale = 0.1;
				}
			} else {
				if (this.scale < 100) {
					this.scale *= event.deltaY / 100;
				} else {
					this.scale = 100;
				}
			}
		});
	}
}
