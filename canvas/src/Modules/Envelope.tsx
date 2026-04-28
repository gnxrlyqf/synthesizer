import { useEffect, useRef, useState } from "react";
import Knob from "../Interactions/Knob";
import { KnobParam } from "../Interactions/Params";
import { useDrag } from "../Interactions/useDrag";
const GRID_SIZE = 16;
const MODULE_WIDTH = 288;
const MODULE_HEIGHT = 480;
const FRAME_INSET_X = 6;
const FRAME_INSET_TOP = 8;
const FRAME_INSET_BOTTOM = 6;

function Envelope(props: {id: string, x: number, y: number, a: number, d: number, s: number, r: number, cameraX: number, cameraY: number}) {
  const moduleRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({x: props.x, y: props.y});

  const [attack, setAttack] = useState(props.a);
  const [decay, setDecay] = useState(props.d);
  const [sustain, setSustain] = useState(props.s);
  const [release, setRelease] = useState(props.r);

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
      className="
        absolute
        m-4
        top-1/5 left-1/4
        flex flex-col
        bg-green-500
        text-white
        rounded-3xl
        overflow-hidden
        font-lexend
      "
    >
      <div
        className="w-full bg-green-500 px-4 pt-2 cursor-move select-none text-center"
        onMouseDown={onMouseDown}
      >
        <span className="text-white text-4xl leading-none">Envelope</span>
      </div>
      <div
        style={panelStyle}
        className="flex flex-1 min-h-0 flex-col gap-3 items-center rounded-2xl bg-black py-4"
      >
        <div className="flex flex-row w-full">
          <div className="w-full flex flex-col gap-3 ">
            <KnobParam id={props.id} name="gain" side="left" color="green-500">
              <Knob max={1000} min={0} step={1} value={attack} onChange={setAttack} size={68} unit="ms" />
            </KnobParam>
            <KnobParam id={props.id} name="gain" side="left" color="green-500">
              <Knob max={1000} min={0} step={1} value={attack} onChange={setAttack} size={68} unit="ms" />
            </KnobParam>
          </div>
          <div className="w-full flex flex-col gap-3">
            <KnobParam id={props.id} name="gain" side="right" color="green-500">
              <Knob max={1000} min={0} step={1} value={attack} onChange={setAttack} size={68} unit="ms" />
            </KnobParam>
            <KnobParam id={props.id} name="gain" side="right" color="green-500">
              <Knob max={1000} min={0} step={1} value={attack} onChange={setAttack} size={68} unit="ms" />
            </KnobParam>
          </div>

        </div>
        <div className="w-full flex items-center">
          <span
            data-port-id={`${props.id}.trigger`}
            data-port-side="left"
            className="h-1 bg-green-500 flex-1"
          />
          <button className="px-4 py-2 rounded-xl border-2 border-green-500 text-white text-xl uppercase tracking-wide leading-none cursor-pointer">
            Trigger
          </button>
          <span className="flex-1" />
        </div>
        <div className="w-full flex items-center mt-1">
          <span className="flex-1" />
          <button className="px-4 py-2 rounded-xl border-2 border-green-500 text-white text-xl uppercase tracking-wide leading-none cursor-pointer">
            Output
          </button>
          <span
            data-port-id={`${props.id}.output`}
            data-port-side="right"
            className="h-1 bg-green-500 flex-1"
          />
        </div>
      </div>
    </div>
  );
}

export default Envelope;