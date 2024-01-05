import { useEffect, useState } from "react";

export interface TypeWriterOptions {
  baseTypeSpeed?: number;
  baseBackspaceSpeed?: number;
  pauseDelay?: number;
  errorChance?: number;
}

export const useTypeWriter = (
  messages: string[],
  {
    baseTypeSpeed = 120,
    baseBackspaceSpeed = 100,
    pauseDelay = 1000,
  }: TypeWriterOptions = {}
): string => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fps = 60;
    let animationFrameId: number;
    let fpsInterval: number, now: number, then: number, elapsed: number;

    let index = 0;
    let subIndex = 0;
    let backspacing = false;
    let lastUpdateTime = 0;
    let pauseTime = 0;

    const setM = () =>
      setMessage(
        messages.length === 0 ? "" : messages[index].substring(0, subIndex)
      );

    const draw = () => {
      const now = performance.now();
      const elapsed = now - lastUpdateTime;
      const currentMessage = messages[index];

      if (backspacing) {
        // Backspacing logic
        if (elapsed > baseBackspaceSpeed) {
          if (subIndex > 0) {
            subIndex--;
            setM();
          } else {
            backspacing = false;
            index = (index + 1) % messages.length;
            setM();
          }
          lastUpdateTime = now;
        }
      } else {
        // Typing logic
        if (subIndex < currentMessage.length) {
          if (elapsed > baseTypeSpeed) {
            subIndex++;
            lastUpdateTime = now;
            setM();
          }
        } else {
          // Pause and backspacing initiation logic
          if (pauseTime === 0) {
            pauseTime = now;
          } else if (now - pauseTime > pauseDelay) {
            backspacing = true;
            pauseTime = 0;
          }
        }
      }
    };

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);
      now = Date.now();
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        draw();
      }
    };

    const startRendering = (fps: number) => {
      fpsInterval = 1000 / fps;
      then = Date.now();
      render();
    };

    startRendering(fps);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return message;
};

export default useTypeWriter;
