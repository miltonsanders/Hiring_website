import clsx from "clsx";
import Horizontal3DotsLoading from "../assets/loader/Horizontal3DotsLoading";

export default ({ showLoading = true }) => {
  return (
    <div
      className={clsx(
        "z-0 fixed top-0 left-0 w-screen h-screen bg-[#0000005e] flex justify-center items-center transition-all animate-toastIn",
        { "opacity-0": !showLoading }
      )}
    >
      <Horizontal3DotsLoading width={120} color="#fee" />
    </div>
  );
};
