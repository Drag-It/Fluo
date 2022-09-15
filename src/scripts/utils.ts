interface IVector2 {
	x: number;
	y: number;
}
interface IVector3 {
	x: number;
	y: number;
	z: number;
}

function fact(x) {
	return x == 0 ? 1 : x * fact(x - 1);
}

function canvasText(position: IVector2, textContent: string) {}

export { IVector2, IVector3, fact, canvasText };
