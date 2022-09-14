import { FluoNode, INodePosition } from "./node";

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
	public selectedNodeOffset: INodePosition;

	constructor(ctx: CanvasRenderingContext2D) {
		this.context = ctx;
	}

	addNode(newNode: FluoNode) {
		this.nodes.push(newNode);
	}

	translateALlNodes(newPositionDelta: INodePosition) {
		this.nodes.forEach((node: FluoNode) => {
			node.translate(newPositionDelta);
		});
	}

	getOverlappingNode(position: INodePosition) {
		const arr = this.nodes.filter((node: FluoNode) => {
			return (
				position.x >= node.position.x &&
				position.x <= node.position.x + node.dimensions.width &&
				position.y >= node.position.y &&
				position.y <= node.position.y + node.dimensions.height
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
}
