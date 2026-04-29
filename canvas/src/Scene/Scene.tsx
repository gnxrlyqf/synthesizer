import Dock from "../Dock";
import type {Module} from './Modules'
import { useEffect, useMemo, useRef, useState } from "react";
import sceneData from "../scene.json";
import { wouldGhostOverlap } from "../Utils/wouldGhostOverlap";
import { snapToGrid } from "../Utils/snapToGrid";
import { ConnectionProvider } from "../ConnectionContext";
import { Oscillator, Gain, Envelope, Output, LFO, VCF, Distortion, Modulator } from '../Modules/Modules'
import { createDockItems, GhostModule, instantiateModule, moduleObjects, type ModuleType } from './DockItems'
import { drawFrame } from "../Patch/Cable";

type Cable = {
  id: string;
  from: string;
  to: string;
};

function randomCableColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 85% 65%)`;
}

const PORT_OFFSETS = {
  oscillator: {
    output: { x: moduleObjects.oscillator.w - 4, y: moduleObjects.oscillator.h - 56 },
    frequency: { x: moduleObjects.oscillator.w / 2, y: 110 },
  },
  gain: {
    input: { x: 4, y: moduleObjects.gain.h - 120 },
    output: { x: moduleObjects.gain.w - 4, y: moduleObjects.gain.h - 56 },
    gain: { x: moduleObjects.gain.w / 2, y: 110 },
  },
  envelope: {
    trigger: { x: 4, y: moduleObjects.envelope.h - 120 },
    output: { x: moduleObjects.envelope.w - 4, y: moduleObjects.envelope.h - 56 },
    attack: { x: moduleObjects.envelope.w / 2, y: 110 },
    sustain: { x: moduleObjects.envelope.w / 2, y: 110 },
    decay: { x: moduleObjects.envelope.w / 2, y: 110 },
    release: { x: moduleObjects.envelope.w / 2, y: 110 },
  },
  output: {
    input: { x: 4, y: moduleObjects.output.h - 68 },
    master: { x: moduleObjects.output.w / 2, y: 110 },
  },
  lfo: {
    output: { x: moduleObjects.lfo.w - 4, y: moduleObjects.lfo.h - 56 },
  },
  vcf: {
    input: { x: 4, y: moduleObjects.vcf.h - 120 },
    output: { x: moduleObjects.vcf.w - 4, y: moduleObjects.vcf.h - 56 },
  },
  distortion: {
    input: { x: 4, y: moduleObjects.distortion.h - 120 },
    output: { x: moduleObjects.distortion.w - 4, y: moduleObjects.distortion.h - 56 },
  },
  modulator: {
    input: { x: 4, y: moduleObjects.modulator.h - 120 },
    output: { x: moduleObjects.modulator.w - 4, y: moduleObjects.modulator.h - 56 },
  },
};

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
    if (m.type === "lfo") {
      const p = m.params as any;
      return { 
        id: m.id, type: "lfo", x: m.x, y: m.y, 
        params: { 
          f: p.frequency ?? 1, 
          w: (p.wave ?? 'sine') as 'sine' | 'square' | 'triangle' | 'saw',
          s: p.sync ?? false 
        } 
      };
    }

    if (m.type === "vcf") {
      const p = m.params as any;
      return { 
        id: m.id, type: "vcf", x: m.x, y: m.y, 
        params: { 
          f: p.frequency ?? 1000, 
          r: p.resonance ?? 1, 
          t: p.type ?? "lowpass" 
        } 
      };
    }

    if (m.type === "distortion") {
      return ({ 
        id: m.id, 
        type: "distortion" as const, 
        x: m.x, 
        y: m.y, 
        params: {
          a: m.params.a ?? 50,
          t: m.params.t ?? "saturation",
          w: (m.params.w ?? 'sine') as 'sine' | 'square' | 'triangle' | 'saw',
        },
      });
    }

    if (m.type === "modulator") {
      return ({ 
        id: m.id, 
        type: "modulator" as const, 
        x: m.x, 
        y: m.y, 
        params: {
          m: (m.params.m ?? "FM") as "AM" | "FM" | "PM" | "RING",
          d: m.params.d ?? 50,
          w: (m.params.w ?? 'sine') as 'sine' | 'square' | 'triangle' | 'saw',
        },
      });
    }
    return ({ id: m.id, type: "output" as const, x: m.x, y: m.y, params: {
        m: m.params.master ?? -6,
      },
    });
  });
}

function RenderModules(props: { modules: Module[]; cameraX: number; cameraY: number; f: React.Dispatch<React.SetStateAction<Cable[]>>}) {
  console.log(props.modules);
  return (
    <ConnectionProvider setCables={props.f}>
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
          case "lfo":
            return (
              <LFO key={m.id} id={m.id} x={m.x} y={m.y} f={m.params.f} w={m.params.w} s={m.params.s}  cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "vcf":
            return (
              <VCF key={m.id} id={m.id} x={m.x} y={m.y} f={m.params.f} r={m.params.r} t={m.params.t} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "distortion":
            return (
              <Distortion key={m.id} id={m.id} x={m.x} y={m.y} a={m.params.a} t={m.params.t} w={m.params.w} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          case "modulator":
            return (
              <Modulator key={m.id} id={m.id} x={m.x} y={m.y} m={m.params.m} d={m.params.d} w={m.params.w} cameraX={props.cameraX} cameraY={props.cameraY} />
            );
          default: return null;
        }
      })}
    </ConnectionProvider>
  );
}

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cableDotCanvasRef = useRef<HTMLCanvasElement>(null);
  const [modules, setModules] = useState<Module[]>(parseScene());
  const [cables, setCables] = useState<Cable[]>(sceneData.cables as Cable[]);
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

    const frame = () => {
      drawFrame({
        canvas: canvasRef.current,
        dotCanvas: cableDotCanvasRef.current,
        modules,
        cables,
        camera,
        cableColors,
        PORT_OFFSETS,
      });
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
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

    console.log(modules);
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
        <RenderModules modules={modules} cameraX={camera.x} cameraY={camera.y} f={setCables}/>
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

export type {Cable};
export default Scene;
