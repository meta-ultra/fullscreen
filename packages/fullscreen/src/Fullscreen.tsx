import { createElement, CSSProperties, FC } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import useEvent from "react-use-event-hook";
import useFullscreen from "./useFullscreen";

type FullscreenProps = {
  style?: CSSProperties;
  className?: string;
  title?: {
    request?: string;
    exit?: string;
  };
};

const Fullscreen: FC<FullscreenProps> = ({ style, className, title }) => {
  const [fullscreen, setFullscreen] = useFullscreen();
  const toggle = useEvent(() => {
    setFullscreen((fullscreen: boolean) => !fullscreen);
  });
  const titleRequest = (title && title.request) || "全屏";
  const titleExit = (title && title.exit) || "退出全屏";

  return (
    <div
      title={fullscreen ? titleExit : titleRequest}
      className={className}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        cursor: "pointer",
        ...style,
      }}
      onClick={toggle}
    >
      {createElement(fullscreen ? AiOutlineFullscreenExit : AiOutlineFullscreen, {
        size: 18,
      })}
    </div>
  );
};

export type { FullscreenProps };
export default Fullscreen;
