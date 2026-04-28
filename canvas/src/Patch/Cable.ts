// Draws all cables and endpoints for the modular scene
import { getAllPortViewportCoordinates, type ModulePorts } from "../Utils/portViewportCoordinates";
import type { Module, ModuleType } from "../Scene/Modules";
import type { Cable } from "../Scene/Scene";

function drawFrame({
	canvas,
	dotCanvas,
	modules,
	cables,
	camera,
	cableColors,
	PORT_OFFSETS,
}: {
	canvas: HTMLCanvasElement | null;
	dotCanvas: HTMLCanvasElement | null;
	modules: Module[];
	cables: Cable[];
	camera: { x: number; y: number };
	cableColors: Map<string, string>;
	PORT_OFFSETS: Record<ModuleType, ModulePorts>;
}) {
	if (!canvas || !dotCanvas) return;

	const ctx = canvas.getContext("2d");
	const dotCtx = dotCanvas.getContext("2d");
	if (!ctx || !dotCtx) return;

	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;

	canvas.width = Math.max(1, Math.floor(rect.width * dpr));
	canvas.height = Math.max(1, Math.floor(rect.height * dpr));
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	ctx.clearRect(0, 0, rect.width, rect.height);

	dotCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
	dotCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
	dotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
	dotCtx.clearRect(0, 0, rect.width, rect.height);

	const portViewportCoordinates = getAllPortViewportCoordinates(
		modules,
		camera,
		PORT_OFFSETS as Record<ModuleType, ModulePorts>
	);

	const portsByModule = new Map(
		portViewportCoordinates.map((entry) => [entry.moduleId, entry.ports])
	);

	for (const cable of cables) {
		const from = cable.from.split(".");
		const to = cable.to.split(".");
		if (from.length !== 2 || to.length !== 2) continue;
		const fromPoint = portsByModule.get(from[0])?.[from[1]];
		const toPoint = portsByModule.get(to[0])?.[to[1]];
		if (!fromPoint || !toPoint) continue;

		drawCable(
			ctx,
			fromPoint.x,
			fromPoint.y,
			toPoint.x,
			toPoint.y,
			cableColors.get(cable.id) ?? "#FFFFFF",
			6
		);

		drawCableEndpointDots(
			dotCtx,
			fromPoint.x,
			fromPoint.y,
			toPoint.x,
			toPoint.y,
			cableColors.get(cable.id) ?? "#FFFFFF",
			12
		);
	}
}

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

export { drawFrame };