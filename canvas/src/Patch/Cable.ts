function drawCable(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color = "#FFFFFF",
	thickness = 6
) {

	const dx = Math.abs(x2 - x1);
	const controlOffset = Math.max(40, dx * 0.5);

	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.bezierCurveTo(
		x1 + controlOffset,
		y1,
		x2 - controlOffset,
		y2,
		x2,
		y2
	);
	ctx.stroke();
	ctx.closePath();
}


function drawCableEndpointDots(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color = "#FFFFFF",
	radius = 6
) {
	const dotRadius = 6;
	ctx.fillStyle = color;

	ctx.beginPath();
	ctx.arc(x1, y1, radius ?? dotRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x2, y2, radius ?? dotRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
}

export { drawCable, drawCableEndpointDots };