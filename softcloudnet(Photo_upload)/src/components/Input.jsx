import clsx from "clsx";

const Input = ({
  type = "text",
  value = null,
  onChange = () => {},
  className = "",
  ...rest
}) => {
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={clsx(
          "mt-1 block w-full rounded-md border border-gray-400 focus:border-indigo-400 focus:ring-indigo-500 sm:text-sm p-3 bg-transparent text-black outline-none",
          className
        )}
        {...rest}
      />
    </>
  );
};

export default Input;
