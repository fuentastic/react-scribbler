import { useEffect, useState } from "react";

const getRandomTypeSpeed = (speed: number) => {
  const randomFactor = Math.random() * 0.2 + 0.9; // Random speed factor between 0.9 and 1.1
  return speed * randomFactor;
};

const getRandomChar = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return characters.charAt(Math.floor(Math.random() * characters.length));
};

export interface HumanWriterOptions {
  baseTypeSpeed?: number;
  baseBackspaceSpeed?: number;
  pauseDelay?: number;
  errorChance?: number;
}

export const useHumanWriter = (
  messages: string[],
  {
    baseTypeSpeed = 120,
    baseBackspaceSpeed = 100,
    pauseDelay = 1000,
    errorChance = 0.05,
  }: HumanWriterOptions = {}
): string => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdateTime = 0;
    let pauseTime = 0;

    let index = 0;
    let subIndex = 0;
    let backspacing = false;
    let errorsMade = 0;
    let msg = "";
    let messageCompleted = false;

    const draw = () => {
      const now = performance.now();
      const elapsed = now - lastUpdateTime;
      const currentMessage = messages[index];

      if (backspacing) {
        if (elapsed > baseBackspaceSpeed) {
          if ((errorsMade > 0 || messageCompleted) && msg.length > 0) {
            // Backspace characters one by one
            msg = msg.substring(0, msg.length - 1);
            if (!messageCompleted) subIndex--;
            if (errorsMade > 0) errorsMade--;
          } else {
            backspacing = false;
            if (messageCompleted && msg.length === 0) {
              // Move to next message once the current one is fully removed
              messageCompleted = false;
              index = (index + 1) % messages.length;
              subIndex = 0;
            }
          }
          lastUpdateTime = now;
        }
      } else {
        if (subIndex < currentMessage.length && !messageCompleted) {
          if (elapsed > getRandomTypeSpeed(baseTypeSpeed)) {
            if (errorsMade === 0 && Math.random() < errorChance) {
              // Introduce a random error
              msg += getRandomChar();
              errorsMade = 1; // Start the error process
            } else {
              // Type the message normally
              msg += currentMessage.charAt(subIndex);
              subIndex++;
              if (errorsMade > 0 && errorsMade < 3) {
                errorsMade++; // Increment the error steps counter
              } else if (errorsMade === 3) {
                errorsMade = 4;
                subIndex++;
                // Once 2 correct characters are added, start backspacing
                backspacing = true;
              }
            }
            lastUpdateTime = now;
          }
        } else if (subIndex >= currentMessage.length && !messageCompleted) {
          // If the end of the message is reached and it's fully typed
          if (pauseTime === 0) {
            pauseTime = now;
          } else if (now - pauseTime > pauseDelay) {
            // Initiate backspacing the whole message
            messageCompleted = true;
            backspacing = true;
            pauseTime = 0;
          }
        }
      }
      setMessage(msg);
    };

    const render = () => {
      animationFrameId = window.requestAnimationFrame(render);
      draw();
    };

    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return message;
};

export default useHumanWriter;
