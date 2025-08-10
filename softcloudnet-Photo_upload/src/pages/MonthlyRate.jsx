import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import useApplicationStore from "../store/applicationStore";
import { BASE_RATES, ROLE_MULTIPLIER } from "../constants";
import { useToast } from "../contexts/ToastContext";
import { BACKEND_API_PATH } from "../config";
import Layout from "../components/Layout";
import Input from "../components/Input";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

const calculateRecommendedRate = (location, roles, experience) => {
  const baseRate = BASE_RATES[location] || 5000;

  const avgRoleMultiplier =
    roles.reduce((acc, role) => acc + (ROLE_MULTIPLIER[role] || 1), 0) /
    roles.length;

  const avgExperience =
    Object.values(experience).reduce((a, b) => a + b, 0) /
    Object.values(experience).length;
  const experienceMultiplier = Math.min(1 + avgExperience * 0.1, 2);

  return Math.round(baseRate * avgRoleMultiplier * experienceMultiplier);
};

export default function MonthlyRate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    token,
    location,
    selectedRoles,
    experience,
    monthlyRate,
    setMonthlyRate,
    personalInfo,
  } = useApplicationStore();
  const [showWarning, setShowWarning] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const recommendedRate = calculateRecommendedRate(
    location.country,
    selectedRoles,
    experience
  );
  const minRate = Math.floor((recommendedRate * 0.7) / 1000) * 1000;
  const maxRate = Math.ceil((recommendedRate * 1.3) / 1000) * 1000;

  const validate = () => {
    const newErrors = {};
    if (!monthlyRate || monthlyRate < 0) {
      newErrors.rate = "Please enter a valid monthly rate";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validate()) {
        // if (!showWarning && (monthlyRate < minRate || monthlyRate > maxRate)) {
        //   setShowWarning(true);
        //   return;
        // }
        setSubmitting(true);
        const response = await axios.put(
          `${BACKEND_API_PATH}/applications/token/${token}`,
          { monthlyRate, step: "/monthly-rate" }
        );
        if (response.data.application) {
          navigate("/commitment");
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
        title="What's your minimum preferred monthly rate?"
        imageSrc={
          <>
            <div className="flex justify-center mb-10">
              <Image
                alt="information"
                src="/images/expected_rate.feebe20.png"
                className="w-40 h-40"
              />
            </div>
            <div className="mx-20">
              <p className="text-white text-center text-3xl font-semibold">
                Get paid fast
              </p>
              <p className="mt-4 text-white text-center">
                Get paid via Deel, which supports over 9 payment methods,
                including PayPal, Revolut, and Binance.
              </p>
            </div>
          </>
        }
        userName={personalInfo.fullName}
      >
        <div className="bg-[#e3e4e6b4] p-4 rounded-xl max-w-[400px]">
          <p className="text-sm text-gray-800 font-semibold mb-2">
            Full-time and part-time SoftCloudNet jobs offer
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            Predictable pay, every month
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            Consistent working hours
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <CheckCircleIcon className="size-5 text-green-500" />
            Up to 24 “flex” days off per year
          </p>
        </div>
        <div className="min-h-[20vh]">
          <label className="block font-medium text-gray-700">
            I want to earn per month (full-time, before tax, USD)
          </label>
          <div className="mt-1 relative rounded-md shadow max-w-[512px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              type="number"
              min="0"
              value={monthlyRate || ""}
              onChange={(e) => {
                setMonthlyRate(parseInt(e.target.value));
                setShowWarning(false);
              }}
              className="pl-7 pr-16"
              placeholder="0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">/month</span>
            </div>
          </div>
          {errors.rate && (
            <p className="mt-2 text-xs text-red-600">{errors.rate}</p>
          )}
          {showWarning && (
            <div className="rounded-md bg-yellow-50 p-4 max-w-[512px]">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Rate Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your rate is outside the recommended range ($
                      {minRate} - ${maxRate}). This is based on your location,
                      roles, and experience. Click Next again to proceed anyway.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <BackButton />
          <NextButton disabled={monthlyRate == 0} onClick={handleSubmit}>
            Next
          </NextButton>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
