import "./styles/Resizable.scss";
import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerHeight * 0.75);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    /** set throttle for resizing preview && editor causing by browser window resize */
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setTimeout(() => {
        /** reset the innerWidth && Height value when browser window resize */
        setInnerWidth(window.innerWidth);
        /** fixing weird behavior of constraint doesn't applied correctly
         *  and just apply it manually
         */
        if (window.innerWidth * 0.75 < width) setWidth(width * 0.75);
        setInnerHeight(window.innerHeight);
      }, 100);
    };
    window.addEventListener("resize", listener);
    return () => {
      /** cleanup listener */
      window.removeEventListener("resize", listener);
    };
  }, [width]);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width: width, // synchronize children width by updating props when horizontal resize stop
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
      resizeHandles: ["e"],
      maxConstraints: [innerWidth * 0.75, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 100],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
