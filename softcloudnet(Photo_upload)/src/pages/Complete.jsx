import { useState } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { COMPLETE_STEPS } from "../constants";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Complete() {
  const [expandedStep, setExpandedStep] = useState("review");

  const [show, setShow] = useState(false);

  const handleClickX = () => {
    setShow(false);
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="space-y-6 max-w-[800px]">
          <p className="text-center text-lg text-gray-800">
            Done! You did great so far!
          </p>
          <p className="text-center text-lg text-gray-800">
            We're glad you want to be a part of our company!
            <br />
            Let's look at the next steps.
          </p>

          <div className="space-y-4">
            <p className="text-2xl font-bold text-gray-700">
              Your vetting process
            </p>
            {COMPLETE_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={clsx("border rounded-lg shadow-lg relative", {
                  "border-indigo-500": step.status === "current",
                })}
              >
                {COMPLETE_STEPS.length > index + 1 && (
                  <div
                    className={clsx(
                      "absolute -bottom-[17px] left-8 h-[16px] w-0 border",
                      {
                        "border-indigo-500": step.status === "complete",
                        "border-indigo-300": step.status !== "complete",
                      }
                    )}
                  ></div>
                )}
                <div
                  className={`rounded-lg flex items-center justify-between p-4 cursor-pointer ${
                    step.status === "complete"
                      ? "bg-green-50"
                      : step.status === "current"
                      ? "bg-blue-50"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setExpandedStep(expandedStep === step.id ? null : step.id)
                  }
                >
                  <div className="flex items-center">
                    {step.status === "complete" ? (
                      <CheckCircleIcon className="size-8 text-green-600" />
                    ) : (
                      <div
                        className={`ml-1 h-6 w-6 rounded-full border-2 ${
                          step.status === "current"
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      />
                    )}
                    <span
                      className={`ml-3 font-semibold text-lg ${
                        step.status === "complete"
                          ? "text-green-700"
                          : step.status === "current"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedStep === step.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {expandedStep === step.id && (
                  <div className="rounded-b-lg p-4 bg-gray-50 border-t">
                    <p className="text text-gray-600">{step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              About Our Company
            </h3>
            <div className="prose prose-sm text-gray-500">
              <p>
                We're a forward-thinking technology company specializing in
                blockchain solutions. Our team is dedicated to pushing the
                boundaries of what's possible in the decentralized world.
              </p>
              <p className="mt-4">
                As a member of our team, you'll have the opportunity to work on
                cutting-edge projects, collaborate with talented developers
                worldwide, and contribute to the future of blockchain
                technology.
              </p>
            </div>
          </div>
        </div>
      </div>
      {show && (
        <div className="fixed bottom-6 right-4 rounded-xl bg-pink-50 p-4 space-y-3 w-[360px] border border-indigo-200">
          <p className="text-indigo-900 font-bold">
            Want to receive updates via WhatsApp?
          </p>
          <p className="text-sm text-gray-600">
            Get notified about your application in real time.
          </p>
          <Input className="max-w-[280px] bg-white" />
          <div>
            <Button varient={"fill"}>RECEIVE WHATSAPP UPDATES</Button>
          </div>
          <p className="text-xs text-gray-500">We promise to never span you.</p>
          <div
            className="absolute top-0 right-2 w-6 h-6 bg-white flex justify-center items-center rounded-full cursor-pointer"
            onClick={handleClickX}
          >
            <XMarkIcon className="size-4 text-indigo-900" />
          </div>
        </div>
      )}
    </Layout>
  );
}
