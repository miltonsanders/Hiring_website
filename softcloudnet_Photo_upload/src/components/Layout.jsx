import clsx from "clsx";
import { stringToColor } from "../helpers";
import Image from "./Image";

export default function Layout({
  children,
  title,
  imageSrc = null,
  userName = null,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "min-h-screen bg-gray-50",
        {
          "flex justify-center": !imageSrc,
        },
        className
      )}
    >
      <div
        className={clsx("gap-2 min-h-screen", {
          flex: imageSrc,
          "w-full max-w-[1440px]": !imageSrc,
        })}
      >
        <div className={clsx({ "w-full flex justify-center": imageSrc })}>
          <div
            className={clsx(
              "w-full py-12 px-4 sm:px-6 lg:px-8 space-y-6 flex flex-col",
              { "max-w-[800px]": imageSrc }
            )}
          >
            <div
              className={clsx("flex justify-between mb-6", {
                "border-b border-b-gray-400": userName,
              })}
            >
              <div
                className={clsx({
                  "border-b border-b-indigo-600 pb-4": userName,
                })}
              >
                <Image alt="logo" src="/logo.png" width="200"/>
              </div>
              {userName && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-10 h-10 rounded-full flex justify-center items-center text-lg text-white border-black"
                    style={{ backgroundColor: stringToColor(userName) }}
                  >
                    {userName[0]}
                  </span>
                  <span className="text-gray-600 font-medium">
                    Hi {userName}
                  </span>
                </div>
              )}
            </div>
            <div className="flex h-full justify-center">
              <div className="flex flex-col w-full gap-12">
                {title && (
                  <p className="text-4xl font-bold text-gray-800">{title}</p>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
        {imageSrc && (
          <div
            className={clsx("w-7/12 hidden md:block", { "!hidden": !imageSrc })}
          >
            <div className="bg-right-image rounded-s-3xl h-full overflow-hidden">
              <div className="h-full max-h-screen flex flex-col justify-center">
                {imageSrc}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
