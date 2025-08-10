import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

const BackButton = ({ children, ...rest }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div>
      <Button
        onClick={handleClick}
        varient={"outline"}
        className={"!p-3 min-w-[120px] !text-lg"}
        {...rest}
      >
        {children || (
          <>
            <ArrowLeftIcon className="pt-1 size-5" />
            Back
          </>
        )}
      </Button>
    </div>
  );
};

export default BackButton;
