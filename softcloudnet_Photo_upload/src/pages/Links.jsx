import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useApplicationStore from "../store/applicationStore";
import { useToast } from "../contexts/ToastContext";
import { BACKEND_API_PATH } from "../config";
import Layout from "../components/Layout";
import Input from "../components/Input";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

export default function Links() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, links, setLinks, personalInfo } = useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!links.linkedin) {
      newErrors.linkedin = "LinkedIn profile is required";
    } else if (!links.linkedin.includes("linkedin.com")) {
      newErrors.linkedin = "Please enter a valid LinkedIn URL";
    }

    if (links.github && !links.github.includes("git")) {
      newErrors.github = "Please enter a valid Git repository URL";
    }

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
          { ...links, step: "/video-intro" }
        );
        if (response.data.application) {
          navigate("/video-intro");
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
        title="Can you add your links?"
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
                ''Working with SoftCloudNet has been a game-changer for us. Their
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              LinkedIn Profile URL
              <sup className="text-red-500 font-bold">*</sup>
            </label>
            <Input
              type="url"
              value={links.linkedin}
              onChange={(e) => setLinks({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/your-profile"
            />
            {errors.linkedin && (
              <p className="mt-2 text-xs text-red-600">{errors.linkedin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GitHub/GitLab/Bitbucket Profile URL
            </label>
            <Input
              type="url"
              value={links.github}
              onChange={(e) => setLinks({ github: e.target.value })}
              placeholder="https://github.com/your-profile"
            />
            {errors.github && (
              <p className="mt-2 text-xs text-red-600">{errors.github}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Custom Link (Portfolio, Blog, etc.)
            </label>
            <Input
              type="url"
              value={links.custom}
              onChange={(e) => setLinks({ custom: e.target.value })}
              placeholder="https://your-website.com"
            />
          </div>

          <div className="flex justify-between">
            <BackButton />
            <NextButton disabled={!links.linkedin} onClick={handleSubmit}>
              Next
            </NextButton>
          </div>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
