import Dock from "../Dock";
import type {Module} from './Modules'
import { useEffect, useMemo, useRef, useState } from "react";
import sceneData from "../scene.json";
import { wouldGhostOverlap } from "../Utils/wouldGhostOverlap";
import { snapToGrid } from "../Utils/snapToGrid";
import { getAllPortViewportCoordinates, type ModulePorts } from "../Utils/portViewportCoordinates";
import { drawCable, drawCableEndpointDots } from "../Patch/Cable";

import { Oscillator, Gain, Envelope, Output } from '../Modules/Modules'
import { createDockItems, GhostModule, instantiateModule, moduleObjects, type ModuleType } from './DockItems'

type PortKey = "input" | "output" | "gain" | "trigger";
type PortPoint = { x: number; y: number };
type SceneModulePorts = Partial<Record<PortKey, PortPoint>>;
type Cable = {
  id: string;
  from: string;
  to: string;
};

function randomCableColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 85% 65%)`;
}

const PORT_OFFSETS: Record<ModuleType, SceneModulePorts> = {
  oscillator: {
    output: { x: moduleObjects.oscillator.w - 4, y: moduleObjects.oscillator.h - 56 },
  },
  gain: {
    input: { x: 4, y: moduleObjects.gain.h - 120 },
    output: { x: moduleObjects.gain.w - 4, y: moduleObjects.gain.h - 56 },
    gain: { x: moduleObjects.gain.w / 2, y: 110 },
  },
  envelope: {
    trigger: { x: 4, y: moduleObjects.envelope.h - 120 },
    output: { x: moduleObjects.envelope.w - 4, y: moduleObjects.envelope.h - 56 },
  },
  output: {
    input: { x: 4, y: moduleObjects.output.h - 68 },
  },
};

function parseCableEndpoint(endpoint: string): { moduleId: string; port: string } | null {
  const splitIndex = endpoint.lastIndexOf(".");
  if (splitIndex <= 0 || splitIndex === endpoint.length - 1) {
    return null;
  }

  return {
    moduleId: endpoint.slice(0, splitIndex),
    port: endpoint.slice(splitIndex + 1),
  };
}

function parseScene(): Module[] {
  return sceneData.modules.map((m) => {
    if (m.type === "oscillator") {
      return ({ id: m.id, type: "oscillator" as const, x: m.x, y: m.y, params: {
          f: m.params.frequency ?? 440,
          w: (m.params.wave ?? 'sine') as 'sine' | 'square' | 'triangle' | 'saw',
        },
      });
    }

    if (m.type === "gain") {
      return ({ id: m.id, type: "gain" as const, x: m.x, y: m.y, params: {
          g: m.params.gain ?? 0,
        },
      });
    }

    if (m.type === "envelope") {
      return ({ id: m.id, type: "envelope" as const, x: m.x, y: m.y, params: {
          a: m.params.attack ?? 100,
          d: m.params.decay ?? 200,
          s: m.params.sustain ?? 0.7,
          r: m.params.release ?? 300,
        },
      });
    }

    return ({ id: m.id, type: "output" as const, x: m.x, y: m.y, params: {
        m: m.params.master ?? -6,
      },
    });
  });
}

function RenderModules(props: { modules: Module[]; cameraX: number; cameraY: number }) {
  return (
    <>
      {props.modules.map((m) => {
        switch (m.type) {
          case "oscillator":
            return (
              <Oscillator key={m.id} id={m.id} x={m.x} y={m.y} f={m.params.f} w={m.params.w} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "gain":
            return (
              <Gain key={m.id} id={m.id} x={m.x} y={m.y} g={m.params.g} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "envelope":
            return (
              <Envelope key={m.id} id={m.id} x={m.x} y={m.y} a={m.params.a} d={m.params.d} s={m.params.s} r={m.params.r} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "output":
            return (
              <Output key={m.id} id={m.id} x={m.x} y={m.y} m={m.params.m} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          default: return null;
        }
      })}
    </>
  );
}

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cableDotCanvasRef = useRef<HTMLCanvasElement>(null);
  const [modules, setModules] = useState<Module[]>(parseScene());
  const [cables] = useState<Cable[]>(sceneData.cables as Cable[]);
  const [ghost, setGhost] = useState<{ type: ModuleType; x: number; y: number } | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panRef = useRef<{ startX: number; startY: number; cameraX: number; cameraY: number } | null>(null);

  const cableColors = useMemo(
    () => new Map(cables.map((cable) => [cable.id, randomCableColor()])),
    [cables]
  );

  useEffect(() => {
    let rafId = 0;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const dotCanvas = cableDotCanvasRef.current;
      if (!canvas || !dotCanvas) {
        rafId = requestAnimationFrame(drawFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      const dotCtx = dotCanvas.getContext("2d");
      if (!ctx || !dotCtx) {
        rafId = requestAnimationFrame(drawFrame);
        return;
      }

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
        const from = parseCableEndpoint(cable.from);
        const to = parseCableEndpoint(cable.to);

        if (!from || !to) {
          continue;
        }

        const fromPoint = portsByModule.get(from.moduleId)?.[from.port];
        const toPoint = portsByModule.get(to.moduleId)?.[to.port];

        if (!fromPoint || !toPoint) {
          continue;
        }

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

      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [cables, modules, camera, cableColors]);

  const canPlaceGhost = ghost
    ? !wouldGhostOverlap(modules, moduleObjects, ghost.type, ghost.x, ghost.y)
    : false;

  const items = useMemo(
    () => createDockItems((type) => {
      const spawnX = snapToGrid(320 - camera.x);
      const spawnY = snapToGrid(120 - camera.y);
      setGhost({ type, x: spawnX, y: spawnY });
    }),
    [camera.x, camera.y]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!panRef.current) return;
      const dx = e.clientX - panRef.current.startX;
      const dy = e.clientY - panRef.current.startY;
      setCamera({
        x: panRef.current.cameraX + dx,
        y: panRef.current.cameraY + dy,
      });
    };

    const handleMouseUp = () => {
      panRef.current = null;
      setIsPanning(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSceneMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && ghost) {
      e.preventDefault();
      if (!canPlaceGhost) return;
      setModules((prev) => [...prev, instantiateModule(ghost.type, ghost.x, ghost.y)]);
      setGhost(null);
      return;
    }
    if (e.button !== 2) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-patch-module='true']")) return;
    e.preventDefault();
    setIsPanning(true);
    panRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      cameraX: camera.x,
      cameraY: camera.y,
    };
  };

  const handleSceneMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ghost) return;
    const worldX = e.clientX - camera.x;
    const worldY = e.clientY - camera.y;
    setGhost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        x: snapToGrid(worldX),
        y: snapToGrid(worldY),
      };
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGhost(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

	return (
		<main
      className={`font-lexend relative h-screen w-screen overflow-hidden bg-zinc-950 text-white ${isPanning ? "cursor-grabbing" : "cursor-auto"}`}
      onMouseDown={handleSceneMouseDown}
      onMouseMove={handleSceneMouseMove}
      onContextMenu={(e) => e.preventDefault()}
    >
      <section className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          id="canvas"
          width="150" height="150"
          className="h-full w-full bg-zinc-900 bg-[radial-gradient(circle,rgba(255,255,255,0.24)_2px,transparent_1.5px)] bg-size-[32px_32px]"
          style={{
            backgroundPosition: `${camera.x}px ${camera.y}px`,
          }}
        />
      </section>

      <section className="pointer-events-none absolute inset-0 z-15">
        <canvas
          ref={cableDotCanvasRef}
          className="h-full w-full"
        />
      </section>

      <section
        className="absolute inset-0 z-10 pointer-events-auto"
        style={{
          transform: `translate3d(${camera.x}px, ${camera.y}px, 0)`,
          transformOrigin: "0 0",
        }}
      >
        <RenderModules modules={modules} cameraX={camera.x} cameraY={camera.y} />
        {ghost && (
          <GhostModule
            type={ghost.type}
            x={ghost.x}
            y={ghost.y}
            className={canPlaceGhost ? "opacity-80" : "border-red-500/90 bg-red-500/10 opacity-90"}
          />
        )}
      </section>

			<section className="pointer-events-none absolute inset-0 z-20">
				<header className="pointer-events-auto absolute left-3 right-3 top-3 flex items-center justify-between rounded-xl border border-zinc-700/70 bg-zinc-900/85 px-4 py-2 backdrop-blur">
					<div className="text-sm font-semibold tracking-wide">Modular Scene</div>
					<div className="text-xs text-zinc-300">{modules.length} modules · 0 cables</div>
				</header>
			</section>
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30">
        <Dock
          items={items}
          panelHeight={80}
          baseItemSize={60}
          magnification={80}
        />
      </div>
		</main>
	);
}

export default Scene;
