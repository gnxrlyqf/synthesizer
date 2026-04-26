import type {Module} from './Modules';

function parseScene(sceneData: any): Module[] {
  return (sceneData.modules as any[]).map((m) => {
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


export { parseScene, parseCableEndpoint }