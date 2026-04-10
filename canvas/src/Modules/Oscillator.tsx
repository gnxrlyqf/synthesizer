import { useEffect, useRef, useState } from "react";
import Knob from "../Inputs/Knob";
import Wave from "../Inputs/Wave";
import { wouldOverlap } from "../utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 364;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

function Oscillator(props: {x: number, y: number, f: number, w: 'sine' | 'square' | 'triangle' | 'saw'}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>({x: props.x, y: props.y});
  const [frequency, setFrequency] = useState(props.f);
  const [waveshape, setWaveshape] = useState<'sine' | 'square' | 'triangle' | 'saw'>(props.w);

  const moduleStyle = {
    width: `${MODULE_WIDTH}px`,
    height: `${MODULE_HEIGHT}px`,
    ...(position ? { left: `${position.x}px`, top: `${position.y}px` } : {}),
  };

  const panelStyle = {
    marginLeft: `${FRAME_INSET_X}px`,
    marginRight: `${FRAME_INSET_X}px`,
    marginTop: `${FRAME_INSET_TOP}px`,
    marginBottom: `${FRAME_INSET_BOTTOM}px`,
  };

  useEffect(() => {
    if (!moduleRef.current || position) {
      return;
    }

    const rect = moduleRef.current.getBoundingClientRect();
    setPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY });
  }, [position]);

  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!moduleRef.current) {
      return;
    }

    const rect = moduleRef.current.getBoundingClientRect();
    const start = position ?? { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
    const offsetX = e.clientX - start.x;
    const offsetY = e.clientY - start.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const snappedX = Math.round((moveEvent.clientX - offsetX) / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round((moveEvent.clientY - offsetY) / GRID_SIZE) * GRID_SIZE;

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
      style={moduleStyle}
      className="
        absolute
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
        <div
          style={panelStyle}
          className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-5"
        >
          <div className="w-full flex items-center">
            <span className="h-1 bg-red-500 flex-1" />
            <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-red-500 flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-wide text-white">Frequency</span>
              <Knob
                max={5000}
                min={20}
                step={1}
                value={frequency}
                onChange={setFrequency}
                size={100}
                unit="Hz"
              />
            </div>
            <span className="flex-1" />
          </div>
          <div className="-mt-1">
            <Wave value={waveshape} onChange={setWaveshape} />
          </div>
          <div className="w-full flex items-center -mt-1">
            <span className="flex-1" />
            <span className="px-4 py-2 rounded-xl border-2 border-red-500 text-white text-xl uppercase tracking-wide leading-none">
              Output
            </span>
            <span className="h-1 bg-red-500 flex-1" />
          </div>
        </div>
    </div>
	)
}

export default Oscillator;