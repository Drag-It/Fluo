export interface IPosition2 {
	x: number;
	y: number;
}
export interface IPosition3 {
	x: number;
	y: number;
	z: number;
}

export function fact(x) {
	return x == 0 ? 1 : x * fact(x - 1);
}

export function canvasText(position: IPosition2, textContent: string) {}
