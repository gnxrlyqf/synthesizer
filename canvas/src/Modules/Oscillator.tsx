import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import Wave from "../Interactions/Wave";
import { wouldOverlap } from "../Utils/wouldOverlap";
import { useConnection } from "../ConnectionContext";
import { KnobParam, Param } from "../Interactions/Params";

const GRID_SIZE = 16;

function Oscillator(props: {id: string, x: number, y: number, f: number, w: 'sine' | 'square' | 'triangle' | 'saw', cameraX: number, cameraY: number}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>({x: props.x, y: props.y});
  const [frequency, setFrequency] = useState(props.f);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);
  const {mode} = useConnection();

  useEffect(() => {
    if (!moduleRef.current || position) { return; }

    const rect = moduleRef.current.getBoundingClientRect();
    setPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
  }, [position]);

  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!moduleRef.current) { return; }

    const start = position ?? { x: props.x, y: props.y };
    const offsetX = e.clientX - props.cameraX - start.x;
    const offsetY = e.clientY - props.cameraY - start.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const worldX = moveEvent.clientX - props.cameraX - offsetX;
      const worldY = moveEvent.clientY - props.cameraY - offsetY;
      const snappedX = Math.round(worldX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(worldY / GRID_SIZE) * GRID_SIZE;

      setPosition((prev) => {
        if (!moduleRef.current || wouldOverlap(snappedX, snappedY, moduleRef.current)) {
          return prev ?? start;
        }

        return {
          x: snappedX,
          y: snappedY,
        };
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  };

	return (
		<div
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={{
        width: "224px", height: "384px",
        ...(position ? { left: `${position.x}px`, top: `${position.y}px` } : {}),
      }}
      className="
        absolute
        m-4
        top-1/4 left-1/2
        flex flex-col
        bg-red-500
        text-white
        rounded-3xl
        overflow-hidden
        font-lexend
      ">
        <div
          className="w-full bg-red-500 px-4 pt-2 cursor-move select-none text-center"
          onMouseDown={handleHeaderMouseDown}
        >
          <span className="text-white text-4xl leading-none">Oscillator</span>
        </div>
        <div className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-5 m-2">
          <div className="w-full flex items-center">
            <span className="h-1 bg-red-500 flex-1" />
            <KnobParam id={props.id} name="frequency" side="left" color="red-500">
              <Knob max={5000} min={20} step={1} value={frequency} onChange={setFrequency} size={100} unit="Hz" disabled={mode != "idle"} />
            </KnobParam>
            <span className="flex-1" />
          </div>
          <div className="mt-1">
            <Wave value={waveshape} onChange={setWaveshape} />
          </div>
          <Param name="output" id={props.id} polarity="source" color="red-500"/>
        </div>
    </div>
	)
}

export default Oscillator;