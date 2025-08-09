import React from "react";
import "./index.css";

const Horizontal3DotsLoading = ({ width = 40, color = "grey" }) => {
  return (
    <svg
      width={width}
      height={width / 4}
      viewBox="0 0 40 10"
      className="anim-typing-loader"
    >
      <circle className="anim-typing-dot" cx="10" cy="5" r="3" fill={color} />
      <circle className="anim-typing-dot" cx="20" cy="5" r="3" fill={color} />
      <circle className="anim-typing-dot" cx="30" cy="5" r="3" fill={color} />
    </svg>
  );
};

export default Horizontal3DotsLoading;
