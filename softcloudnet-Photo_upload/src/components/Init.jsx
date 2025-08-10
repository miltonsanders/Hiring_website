import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generateRandomToken, getSavedToken, setSavedToken } from "../helpers";
import { BACKEND_API_PATH } from "../config";
import useApplicationStore from "../store/applicationStore";
import { useToast } from "../contexts/ToastContext";
import Button from "./Button";
import LoadingPage from "./LoadingPage";

export default () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { started, setToken, ...applyStore } = useApplicationStore();
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [tokenExist, setTokenExist] = useState(false);

  const resetToken = useCallback(() => {
    setSavedToken("");
    const newToken = generateRandomToken();
    setToken(newToken);
  }, [setToken]);

  useEffect(() => {
    if (!started) {
      navigate(started); //  hack  remove comment
    }
  }, [navigate, started]);

  useEffect(() => {
    let timer = setTimeout(() => {
      const token = getSavedToken();
      if (token) {
        setTokenExist(true);
      } else {
        resetToken();
        setTimeout(() => {
          setShowLoading(false);
          setTimeout(() => {
            setLoading(false);
          }, 150);
        }, 500);
      }
    }, 500);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resetToken]);

  const handleClickStartOver = useCallback(() => {
    resetToken();
    setTokenExist(false);
    setTimeout(() => {
      setShowLoading(false);
      setTimeout(() => {
        setLoading(false);
      }, 150);
    }, 500);
  }, [resetToken]);

  const handleClickContinue = useCallback(async () => {
    try {
      const token = getSavedToken();
      const response = await axios.get(
        `${BACKEND_API_PATH}/applications/token/${token}`
      );
      if (response.data.application) {
        const apply = response.data.application;
        setToken(token);
        applyStore.setStart(true);
        applyStore.setPersonalInfo({
          fullName: apply.user.fullName,
          email: apply.user.email,
          jobSearchStatus: apply.jobSearchStatus,
          agreedToTerms: false,
        });
        applyStore.setLocation({
          country: apply.location_country,
          state: apply.location_state,
          city: apply.location_city,
          isMoving: apply.location_isMoving,
        });
        applyStore.setSelectedRoles(apply.selectedRoles);
        applyStore.setMainSkills(apply.mainSkills);
        applyStore.setRelevantSkills(apply.relevantSkills);
        applyStore.setExperience(apply.experience);
        applyStore.setMonthlyRate(apply.monthlyRate);
        applyStore.setCommitment(apply.commitment);
        applyStore.setEnglishLevel(apply.englishLevel);
        applyStore.setAvailability({
          fullTime: apply.availability_fullTime,
          partTime: apply.availability_partTime,
        });
        applyStore.setLinks({
          linkedin: apply.linkedin,
          github: apply.github,
          custom: apply.custom,
        });
        setTokenExist(false);
        setTimeout(() => {
          setShowLoading(false);
          setTimeout(() => {
            setLoading(false);
            navigate(apply.step);
          }, 150);
        }, 500);
      } else handleClickStartOver();
    } catch (error) {
      console.log(error);
      addToast({
        message: `Unexpected server error. Please try it later.`,
        type: "warn",
      });
    }
  }, [navigate, handleClickStartOver, addToast, setToken, applyStore]);

  return (
    loading && (
      <>
        <LoadingPage showLoading={showLoading} />
        <div className="z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
          {tokenExist && (
            <div className="w-full max-w-[500px] p-8 bg-gray-50  relative space-y-6 animate-toastIn rounded-xl">
              <p className="text-center font-bold text-xl text-[#15172f]">
                Seems you already have an unfinished application.
              </p>
              <p className="text-center text-[#434343]">
                Do you want to continue or start from scratch?
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  className={"!text-md !p-3"}
                  varient="outline"
                  onClick={handleClickStartOver}
                >
                  Start from scratch
                </Button>
                <Button
                  className={"!text-md !p-3"}
                  varient="fill"
                  onClick={handleClickContinue}
                >
                  Let's Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    )
  );
};
