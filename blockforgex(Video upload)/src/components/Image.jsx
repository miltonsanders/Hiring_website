import clsx from "clsx";
import { useState } from "react";

const Image = ({ className, ...props }) => {
  const [load, setLoad] = useState(false);

  const handleOnLoad = () => setLoad(true);

  return (
    <>
      <img
        {...props}
        onLoad={handleOnLoad}
        className={clsx(className, { hidden: !load })}
      />
    </>
  );
};

export default Image;
