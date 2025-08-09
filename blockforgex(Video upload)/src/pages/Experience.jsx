import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useApplicationStore from "../store/applicationStore";
import { BACKEND_API_PATH } from "../config";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import { sliderToMonths } from "../helpers";
import Image from "../components/Image";

export default function Experience() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, selectedRoles, experience, setExperience, personalInfo } =
    useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    selectedRoles.forEach((role) => {
      if (!experience[role] || experience[role] < 0) {
        newErrors[role] = "Please enter valid years of experience";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validate()) {
        setSubmitting(true);
        const response = await axios.put(
          `${BACKEND_API_PATH}/applications/token/${token}`,
          { experience, step: "/experience" }
        );
        if (response.data.application) {
          navigate("/monthly-rate");
        }
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
        title={`How much full-time, professional experience do you have in ${selectedRoles[0].toUpperCase()}?`}
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
        <div className="bg-[#e3e4e6b4] p-4 rounded-xl max-w-[400px]">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            Paid work in your role after finishing school.
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            Doesn't include internships.
          </p>
        </div>
        <div className="space-y-6 min-h-[20vh]">
          {selectedRoles.map((role) => (
            <div key={role}>
              <p className="mb-2 block font-medium text-gray-700">
                Years of experience as {role}
              </p>
              <label className="mt-4 mb-2 block text-sm text-gray-600">
                Use the slider
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={experience[role] || 0}
                onChange={(e) =>
                  setExperience({ [role]: parseFloat(e.target.value) })
                }
                className="mt-2 experience-slider"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>months</span>
                {experience[role] != 0 && (
                  <span className="font-semibold text-sm">
                    {sliderToMonths(experience[role] || 0)}
                  </span>
                )}
                <span>years</span>
              </div>
              {errors[role] && (
                <p className="mt-2 text-xs text-red-600">{errors[role]}</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <BackButton />
          <NextButton onClick={handleSubmit}>Next</NextButton>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
