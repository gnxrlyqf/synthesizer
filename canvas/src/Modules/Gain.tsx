import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import { useConnection } from "../ConnectionContext";
import { KnobParam, Param } from "../Interactions/Params";
import { useDrag } from "../Interactions/useDrag";
const GRID_SIZE = 16;
const MODULE_WIDTH = 224;
const MODULE_HEIGHT = 384;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

function Gain(props: {id: string, x: number, y: number, g: number, cameraX: number, cameraY: number}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: props.x, y: props.y});
  const [gain, setGain] = useState(props.g);
  const {mode} = useConnection();

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

  const onMouseDown = useDrag(props, position, setPosition, moduleRef);

  return (
    <div
      ref={moduleRef}
      data-patch-module="true"
      data-module-id={props.id}
      style={moduleStyle}
      className=" absolute m-4 top-1/3 left-1/3 flex flex-col bg-blue-500 text-white rounded-3xl overflow-hidden font-lexend"
    >
      <div
        className="w-full bg-blue-500 px-4 pt-2 cursor-move select-none text-center"
        onMouseDown={onMouseDown}
      >
        <span className="text-white text-4xl leading-none">Gain</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-5"
      >
        <KnobParam id={props.id} name="gain" side="left" color="blue-500">
          <Knob max={10} min={-10} step={0.1} value={gain} onChange={setGain} size={100} unit="dB" disabled={mode != "idle"}/>
        </KnobParam>
        <Param id={props.id} name="input" polarity="target" color="blue-500"/>
        <Param id={props.id} name="output" polarity="source" color="blue-500"/>
      </div>
    </div>
  );
}

export default Gain;