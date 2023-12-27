/**
 * Notes:
 * 1. we can capture the keydown event when press F11 to request fullscreen, but it's no possible verse vise.
 * 2. up to 06/16/2023, the API document.fullscreenElement always returns null still, we cannot determine if in fullscreen mode through it.
 * 3. up until 06/16/2023, the API document.onfullscreenchange would not fire when enter or exit fullscreen still.
 * 4. the f11-fullscreen and programmatic-fullscreen is not 100% the same.(refer to: https://www.656463.com/wenda/rgsyF11cfqpAPIzwfgz_112)
 */
import { useEffect, useState } from "react";
import { isDevToolsOpen } from "./devtools";

enum DetectF11 {
  STRICT = "strict",
  LOOSE = "loose",
  NONE = "none",
}

/**
 * @param {DetectF11} detectF11 - DetectF11.STRICT might make fullscreen feature disabled when DevTools is open.
 * @returns
 */
const useFullscreen = (detectF11 = DetectF11.STRICT) => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (fullscreen) {
          await document.documentElement.requestFullscreen();
        } else if (document.fullscreenElement != null) {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [fullscreen]);

  useEffect(() => {
    if (detectF11 == DetectF11.NONE) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == "F11") {
        setFullscreen((fullscreen) => !fullscreen);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeydown);

    // caution: the following code would disable the fullscreen feature when DevTools shows up except undock into separate window.
    const handleResize = () => {
      setFullscreen((fullscreen) => {
        const vfs = window.screen.height == document.documentElement.clientHeight;
        const hfs = window.screen.width == document.documentElement.clientWidth;
        const fullscreenStatus = Number(fullscreen);
        let fullscreenInPractice = fullscreenStatus;
        if (detectF11 == DetectF11.STRICT) {
          fullscreenInPractice = Number(vfs && hfs ? 1 : isDevToolsOpen() ? vfs || hfs : 0);
        } else if (detectF11 == DetectF11.LOOSE) {
          fullscreenInPractice = Number(vfs || hfs);
        }

        return fullscreenInPractice ^ fullscreenStatus ? !fullscreen : fullscreen;
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
    };
  }, [detectF11]);

  return [fullscreen, setFullscreen] as [typeof fullscreen, typeof setFullscreen];
};

export default useFullscreen;
