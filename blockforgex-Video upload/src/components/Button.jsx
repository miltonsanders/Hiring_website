import clsx from "clsx";

export default ({ children, className, varient, ...rest }) => {
  return (
    <button
      className={clsx(
        "w-full max-w-[280px] inline-flex items-center justify-center gap-2 rounded-full py-1 px-4 text-sm/6 font-semibold transition-all hover:shadow hover:shadow-gray-600",
        {
          "border border-[#5258fb] bg-white text-[#15172f]":
            varient == "outline",
          "bg-[#5258fb] disabled:bg-[#5258fb40] text-white": varient == "fill",
        },
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
