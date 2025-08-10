import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { Switch } from "@headlessui/react";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import useApplicationStore from "../store/applicationStore";
import { setSavedToken } from "../helpers";
import { BACKEND_API_PATH } from "../config";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import Input from "../components/Input";
import NextButton from "../components/NextButton";
import LoadingPage from "../components/LoadingPage";
import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "../components/Image";

export default function PersonalInfo() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, personalInfo, setPersonalInfo, setStart } =
    useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!personalInfo.fullName) newErrors.fullName = "Full name is required";
    if (!personalInfo.email) newErrors.email = "Email is required";
    if (!personalInfo.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!personalInfo.jobSearchStatus)
      newErrors.jobSearchStatus = "Please select your job search status";
    if (!personalInfo.agreedToTerms)
      newErrors.agreedToTerms = "You must agree to the terms of service";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setStart(true);
  }, [setStart]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validate()) {
        setSubmitting(true);
        console.log("personal: ", personalInfo);
        
        const response = await axios.post(
          `${BACKEND_API_PATH}/applications/token/${token}`,
          personalInfo
        );
        if (response.data.application) {
          setSavedToken(token);
          navigate("/business-type");
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
        title="Apply for Exciting Opportunities in Blockchain and Crypto"
        imageSrc={
          <>
            <div className="flex justify-center">
              <Image
                alt="information"
                src="/images/basic-information.c660863.png"
                className="max-w-72 mb-10"
              />
            </div>
            <div className="mx-20">
              <p className="text-white flex items-center gap-1">
                <CheckIcon className="size-4 text-green-500" />
                We gather to be stronger ONE
              </p>
              <p className="text-white flex items-center gap-1">
                <CheckIcon className="size-4 text-green-500" />
                Career growth opportunities
              </p>
              <p className="text-white flex items-center gap-1">
                <CheckIcon className="size-4 text-green-500" />
                Transforming vision into reality
              </p>
            </div>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="max-w-[512px]">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              value={personalInfo.fullName}
              onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
            />
            {errors.fullName && (
              <p className="mt-2 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="max-w-[512px]">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ email: e.target.value })}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Search Status
            </label>
            <div className="mt-2 space-y-4">
              <div>
                <input
                  type="radio"
                  name="jobSearchStatus"
                  value="actively"
                  id="input-jobSearchStatus-radio-0"
                  checked={personalInfo.jobSearchStatus === "actively"}
                  onChange={(e) =>
                    setPersonalInfo({ jobSearchStatus: e.target.value })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  hidden
                />
                <label
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer"
                  htmlFor="input-jobSearchStatus-radio-0"
                >
                  {personalInfo.jobSearchStatus === "actively" ? (
                    <CheckCircleIcon className="size-5 fill-indigo-800 hover:fill-indigo-600 transition" />
                  ) : (
                    <MinusCircleIcon className="size-5 fill-indigo-400 hover:fill-indigo-600 transition" />
                  )}
                  Actively looking for a job
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="jobSearchStatus"
                  value="casually"
                  id="input-jobSearchStatus-radio-1"
                  checked={personalInfo.jobSearchStatus === "casually"}
                  onChange={(e) =>
                    setPersonalInfo({ jobSearchStatus: e.target.value })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  hidden
                />
                <label
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer"
                  htmlFor="input-jobSearchStatus-radio-1"
                >
                  {personalInfo.jobSearchStatus === "casually" ? (
                    <CheckCircleIcon className="size-5 fill-indigo-800 hover:fill-indigo-600 transition" />
                  ) : (
                    <MinusCircleIcon className="size-5 fill-indigo-400 hover:fill-indigo-600 transition" />
                  )}
                  Casually looking
                </label>
              </div>
            </div>
            {errors.jobSearchStatus && (
              <p className="mt-2 text-xs text-red-600">
                {errors.jobSearchStatus}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              For evaluation and communication purposes in line with
              <a
                href="https://blockforgex.com/"
                target="_blank"
                className="ml-1 mr-1"
              >
                privacy policy
              </a>
              and
              <a
                href="https://blockforgex.com/"
                target="_blank"
                className="ml-1"
              >
                cookie policy
              </a>
              ,
              <br />I consent to:
            </p>
            <input
              type="checkbox"
              id="input-agreetos-checkbox"
              checked={personalInfo.agreedToTerms}
              onChange={(e) =>
                setPersonalInfo({ agreedToTerms: e.target.checked })
              }
              hidden
            />
            <input
              type="checkbox"
              id="input-agreetos-checkbox1"
              checked={personalInfo.agreedToTerms1}
              onChange={(e) =>
                setPersonalInfo({ agreedToTerms1: e.target.checked })
              }
              hidden
            />
            <input
              type="checkbox"
              id="input-agreetos-checkbox2"
              checked={personalInfo.agreedToTerms2}
              onChange={(e) =>
                setPersonalInfo({ agreedToTerms2: e.target.checked })
              }
              hidden
            />
            <label
              className="flex items-center gap-2 text-xs text-gray-600 select-none"
              htmlFor="input-agreetos-checkbox"
            >
              <Switch
                checked={personalInfo.agreedToTerms}
                onChange={(e) =>
                  setPersonalInfo({
                    agreedToTerms: !personalInfo.agreedToTerms,
                  })
                }
                className="group relative flex h-5 w-8 min-w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                    {
                      "bg-indigo-600": personalInfo.agreedToTerms,
                      "bg-indigo-50 border border-indigo-400":
                        !personalInfo.agreedToTerms,
                    }
                  )}
                />
              </Switch>
              The processing and storing of my submitted personal data.
            </label>
            <label
              className="flex items-center gap-2 text-xs text-gray-600 select-none"
              htmlFor="input-agreetos-checkbox1"
            >
              <Switch
                checked={personalInfo.agreedToTerms1}
                onChange={(e) =>
                  setPersonalInfo({
                    agreedToTerms1: !personalInfo.agreedToTerms1,
                  })
                }
                className="group relative flex h-5 w-8 min-w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                    {
                      "bg-indigo-600": personalInfo.agreedToTerms1,
                      "bg-indigo-50 border border-indigo-400":
                        !personalInfo.agreedToTerms1,
                    }
                  )}
                />
              </Switch>
              The use of call recording, note-taking tools, and external
              assessment tools.
            </label>
            <label
              className="flex items-center gap-2 text-xs text-gray-600 select-none"
              htmlFor="input-agreetos-checkbox2"
            >
              <Switch
                checked={personalInfo.agreedToTerms2}
                onChange={(e) =>
                  setPersonalInfo({
                    agreedToTerms2: !personalInfo.agreedToTerms2,
                  })
                }
                className="group relative flex h-5 w-8 min-w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                    {
                      "bg-indigo-600": personalInfo.agreedToTerms2,
                      "bg-indigo-50 border border-indigo-400":
                        !personalInfo.agreedToTerms2,
                    }
                  )}
                />
              </Switch>
              The use of cookies to improve functionality, enhance experience,
              and analyze site usage.
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="mt-2 text-xs text-red-600">{errors.agreedToTerms}</p>
          )}
          <div className="flex justify-end">
            <NextButton
              type={"submit"}
              disabled={
                !personalInfo.fullName ||
                !personalInfo.email ||
                !personalInfo.agreedToTerms
              }
            >
              Next
            </NextButton>
          </div>
        </form>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
