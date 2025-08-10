import clsx from "clsx";
import Button from "./Button";

const NextButton = ({ children, className, ...rest }) => {
  return (
    <div>
      <Button
        className={clsx("!p-3 !text-lg min-w-[120px]", className)}
        varient={"fill"}
        {...rest}
      >
        {children}
      </Button>
    </div>
  );
};

export default NextButton;
