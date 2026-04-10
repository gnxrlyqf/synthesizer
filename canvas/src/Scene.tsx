import Dock from "./Dock";
import Oscillator from "./Modules/Oscillator";
import Gain from "./Modules/Gain";
import Envelope from "./Modules/Envelope";
import Output from "./Modules/Output";
import type {Module} from './Modules'
import { useState } from "react";
import sceneData from "./scene.json";

function OscIcon(props: {size: number}) {
  return (
		<svg
			viewBox="0 0 400 400"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			width={props.size}
			height={props.size}
		>
			<path
				d="M57 193.48C61.6479 150.493 84.5896 129 125.825 129C187.678 129 195.16 272 269.08 272C330.771 272 343 201.978 343 193.48"
				stroke="currentColor"
				strokeOpacity="1"
				strokeWidth="30"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
  )
}

function GainIcon(props: {size: number}) {
  return (
    <svg fill="#FFFFFF" height={props.size} width={props.size} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="85 170 342 342"
      >
      <g><g><g><path d="M376.685,220.648c-0.047-0.047-0.098-0.085-0.145-0.131c-30.874-30.803-73.482-49.85-120.539-49.85
        c-94.257,0-170.667,76.41-170.667,170.667S161.743,512,256,512s170.667-76.41,170.667-170.667
        c0-47.058-19.047-89.666-49.85-120.539C376.77,220.747,376.732,220.695,376.685,220.648z M256,469.333
        c-70.693,0-128-57.307-128-128s57.307-128,128-128c27.644,0,53.241,8.764,74.165,23.665l-89.25,89.25
        c-8.331,8.331-8.331,21.839,0,30.17c8.331,8.331,21.839,8.331,30.17,0l89.25-89.25c14.9,20.924,23.665,46.521,23.665,74.165
        C384,412.026,326.693,469.333,256,469.333z"/></g></g></g>
    </svg>
  )
}

function EnvelopeIcon(props: {size: number}) {
  return (
    <svg 
 width={props.size} height={props.size} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path stroke="#FFFFFF" fill="#FFFFFF" strokeWidth={10}
        d="M25 184c-.47 2.68-.227 4.354 1 6s4.563 2.464 8 2c3.437-.464 5.078-.958 6-4 .922-3.042 40.167-102.359 40.167-102.359 1.012-2.563 2.655-2.563 3.676.018l15.08 38.128c1.218 3.077 4.9 5.591 8.21 5.616L188 130s26.23 53.28 27.993 56.358c1.764 3.079 4.94 5.225 7.237 5.24 2.297.016 5.15-2.404 6.552-3.598 1.402-1.194 2.88-3.828 1.661-6.824-1.218-2.995-29.623-58.905-31.318-61.992C198.43 116.096 196.266 114 192 114s-76.877-.318-76.877-.318c-2.207-.01-4.608-1.691-5.37-3.777 0 0-12.403-33.889-13.717-37.905-1.314-4.016-6.912-7.827-14.036-7.827S70.086 66.695 68 72c-2.086 5.305-42.53 109.32-43 112z"/>
    </svg>
  )
}

function OutputIcon(props: {size: number}) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7H12.01M12.5 7C12.5 7.27614 12.2761 7.5 12 7.5C11.7239 7.5 11.5 7.27614 11.5 7C11.5 6.72386 11.7239 6.5 12 6.5C12.2761 6.5 12.5 6.72386 12.5 7ZM15 14C15 15.6569 13.6569 17 12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14ZM8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V6.2C19 5.0799 19 4.51984 18.782 4.09202C18.5903 3.71569 18.2843 3.40973 17.908 3.21799C17.4802 3 16.9201 3 15.8 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.07989 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.07989 21 8.2 21Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  )
}

const items = [
  { icon: <OscIcon size={50} />, label: 'Oscillator', onClick: () => alert('Home!') },
  { icon: <GainIcon size={30} />, label: 'Gain', onClick: () => alert('Home!') },
  { icon: <EnvelopeIcon size={40} />, label: 'Envelope', onClick: () => alert('Home!') },
  { icon: <OutputIcon size={40} />, label: 'Output', onClick: () => alert('Home!') },
];

function normalizeWave(wave: unknown): 'sine' | 'square' | 'triangle' | 'saw' {
  if (wave === 'square' || wave === 'triangle' || wave === 'sine') {
    return wave;
  }

  if (wave === 'sawtooth' || wave === 'saw') {
    return 'saw';
  }

  return 'sine';
}

function parseScene(): Module[] {
  return sceneData.map((m) => {
    if (m.type === "oscillator") {
      return {
        id: m.id,
        type: "oscillator" as const,
        x: m.x,
        y: m.y,
        params: {
          f: m.params.frequency ?? 440,
          w: normalizeWave(m.params.wave),
        },
      };
    }

    if (m.type === "gain") {
      return {
        id: m.id,
        type: "gain" as const,
        x: m.x,
        y: m.y,
        params: {
          g: m.params.gain ?? 0,
        },
      };
    }

    if (m.type === "envelope") {
      return {
        id: m.id,
        type: "envelope" as const,
        x: m.x,
        y: m.y,
        params: {
          a: m.params.attack ?? 100,
          d: m.params.decay ?? 200,
          s: m.params.sustain ?? 0.7,
          r: m.params.release ?? 300,
        },
      };
    }

    return {
      id: m.id,
      type: "output" as const,
      x: m.x,
      y: m.y,
      params: {
        m: m.params.master ?? -6,
      },
    };
  });
}

function RenderModules(props: { modules: Module[] }) {
  return (
    <>
      {props.modules.map((m) => {
        switch (m.type) {
          case "oscillator":
            return (
              <Oscillator
                key={m.id}
                x={m.x}
                y={m.y}
                f={m.params.f}
                w={m.params.w}
              />
            );

          case "gain":
            return (
              <Gain
                key={m.id}
                x={m.x}
                y={m.y}
                g={m.params.g}
              />
            );

          case "envelope":
            return (
              <Envelope
                key={m.id}
                x={m.x}
                y={m.y}
                a={m.params.a}
                d={m.params.d}
                s={m.params.s}
                r={m.params.r}
              />
            );

          case "output":
            return (
              <Output
                key={m.id}
                x={m.x}
                y={m.y}
                m={m.params.m}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}

function Scene() {
  const [modules] = useState<Module[]>(parseScene());


	return (
		<main className="font-lexend relative h-screen w-screen overflow-hidden bg-zinc-950 text-white">
      <section className="absolute inset-0 z-0">
        <canvas className="h-full w-full bg-zinc-900 bg-[radial-gradient(circle,rgba(255,255,255,0.24)_1px,transparent_1.5px)] bg-size-[16px_16px] bg-position-[8px_8px]" />
      </section>

      <section className="absolute inset-0 z-10 pointer-events-auto">
        <RenderModules modules={modules}/>
      </section>

			<section className="pointer-events-none absolute inset-0 z-20">
				<header className="pointer-events-auto absolute left-3 right-3 top-3 flex items-center justify-between rounded-xl border border-zinc-700/70 bg-zinc-900/85 px-4 py-2 backdrop-blur">
					<div className="text-sm font-semibold tracking-wide">Modular Scene</div>
					<div className="text-xs text-zinc-300">{modules.length} modules · 0 cables</div>
				</header>
			</section>
      <div className="pointer-events-auto absolute inset-x-0 bottom-0">
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
