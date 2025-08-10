import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import useApplicationStore from "../store/applicationStore";
import { useToast } from "../contexts/ToastContext";
import { BACKEND_API_PATH } from "../config";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

const englishLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description:
      "I can interact in a simple way, if the other person talks slowly and is able to cooperate.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description:
      "I can explain my decisions and understand most instructions, in both text and speech. I occasionally need things to be repeated so I can understand.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description:
      "I understand and use complex speech and text, including technical topics in my field. I can speak spontaneously, without causing strain for myself or others.",
  },
  {
    id: "proficient",
    label: "Proficient",
    description:
      "I can easily understand almost everything I hear or read, and speak confidently using finer shades of meaning in complex situations.",
  },
];

export default function EnglishLevel() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, englishLevel, setEnglishLevel, personalInfo } =
    useApplicationStore();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!englishLevel) {
        setError("Please select your English level");
        return;
      }
      setSubmitting(true);
      const response = await axios.put(
        `${BACKEND_API_PATH}/applications/token/${token}`,
        { englishLevel, step: "/english-level" }
      );
      if (response.data.application) {
        navigate("/links");
      }
    } catch (error) {
      console.log(error);
      addToast({
        message: `Unexpected server error. Please try it later.`,
        type: "warn",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Layout
        title="What's your English level?"
        imageSrc={
          <>
            <div className="flex justify-center mb-10">
              <div className="w-40 h-40 bg-background-image rounded-full px-1 py-1">
                <Image
                  alt="information"
                  src="/images/testi.png"
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="mx-20">
              <p className="text-white text-center text-lg font-semibold">
                ''Working with Blockforgex has been a game-changer for us. Their
                expertise in Blockchain technology helped us streamline our
                processes and enhance security, leading to unprecedented growth.
                Their team is highly professional.''
              </p>
              <p className="mt-4 text-white text-center">Alice Johnson</p>
              <p className="text-gray-400 text-center text-sm">
                CEO, FinTech Innovations Ltd.
              </p>
            </div>
          </>
        }
        userName={personalInfo.fullName}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            {englishLevels.map((level) => (
              <div
                key={level.id}
                className={clsx(
                  `relative flex p-4 border rounded-lg cursor-pointer transition-all`,
                  {
                    "border-indigo-300 bg-indigo-50": englishLevel === level.id,
                    "hover:bg-gray-50": englishLevel !== level.id,
                  }
                )}
                onClick={() => setEnglishLevel(level.id)}
              >
                <input
                  type="radio"
                  checked={englishLevel === level.id}
                  onChange={() => setEnglishLevel(level.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  hidden
                />
                <div className="pt-1">
                  {englishLevel === level.id ? (
                    <CheckCircleIcon className="size-5 fill-indigo-800 hover:fill-indigo-500 transition" />
                  ) : (
                    <MinusCircleIcon className="size-5 fill-indigo-300 hover:fill-indigo-500 transition" />
                  )}
                </div>
                <div className="ml-3">
                  <label className="font-medium text-gray-700">
                    {level.label}
                  </label>
                  <p className="text-gray-500">{level.description}</p>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-between">
            <BackButton />
            <NextButton disabled={!englishLevel} onClick={handleSubmit}>
              Next
            </NextButton>
          </div>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
