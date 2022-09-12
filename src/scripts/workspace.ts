import { FluoNode, INodePosition } from "./node";

export default class Workspace {
	public context: CanvasRenderingContext2D;
	public nodes: Array<FluoNode> = [];

	constructor(ctx: CanvasRenderingContext2D) {
		this.context = ctx;
	}

	addNode(newNode: FluoNode) {
		this.nodes.push(newNode);
	}

	changeAllNodePositions(newPositionDelta: INodePosition) {
		this.nodes.forEach((node: FluoNode) => {
			node.position.x += newPositionDelta.x;
			node.position.y += newPositionDelta.y;
		});
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
