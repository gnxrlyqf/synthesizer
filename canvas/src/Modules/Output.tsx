import { useEffect, useRef, useState } from "react";
import Knob from "../Inputs/Knob";
import { wouldOverlap } from "../utils/wouldOverlap";

const GRID_SIZE = 16;
const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 352;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

function Output(props: {x: number, y: number, m: number, cameraX: number, cameraY: number}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>({x: props.x, y: props.y});
  const [master, setMaster] = useState(props.m);

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
      style={moduleStyle}
      className="
        absolute
        top-1/6 left-2/3
        flex flex-col
        bg-yellow-500
        text-white
        rounded-3xl
        overflow-hidden
        font-lexend
      "
    >
      <div
        className="w-full bg-yellow-500 px-4 pt-2 cursor-move select-none text-center"
        onMouseDown={handleHeaderMouseDown}
      >
        <span className="text-white text-4xl leading-none">Output</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-6 items-center rounded-2xl bg-black py-5"
      >
        <div className="w-full flex items-center justify-center">
          <div className="px-3 pt-2 pb-1 rounded-xl border-2 border-yellow-500 flex flex-col items-center gap-1">
            <span className="text-xs uppercase tracking-wide text-white">Master</span>
            <Knob
              max={0}
              min={-30}
              step={0.1}
              value={master}
              onChange={setMaster}
              size={100}
              unit="dB"
            />
          </div>
        </div>
        <div className="w-full flex items-center">
          <span className="h-1 bg-yellow-500 flex-1" />
          <span className="px-4 py-2 rounded-xl border-2 border-yellow-500 text-white text-xl uppercase tracking-wide leading-none">
            Input
          </span>
          <span className="flex-1" />
        </div>
      </div>
    </div>
  );
}

export default Output;
