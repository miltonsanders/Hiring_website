import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useApplicationStore from "../store/applicationStore";
import { SKILLS_BY_ROLES } from "../constants";
import { BACKEND_API_PATH } from "../config";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import SkillItem from "../components/SkillItem";
import LoadingPage from "../components/LoadingPage";

export default function MainSkills() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, selectedRoles, mainSkills, setMainSkills, personalInfo } =
    useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const availableSkills = [
    ...new Set(selectedRoles.flatMap((role) => SKILLS_BY_ROLES[role] || [])),
  ];

  const validate = () => {
    const newErrors = {};
    if (mainSkills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }
    mainSkills.forEach((skill) => {
      if (skill.years <= 0) {
        newErrors[`${skill.name}-years`] = "Years must be greater than 0";
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
          { mainSkills, step: "/role-selection" }
        );
        if (response.data.application) {
          navigate("/experience");
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
        title="What's your main skill?"
        imageSrc={
          <div className="flex justify-center">
            <p className="text-white text-center text-3xl font-semibold max-w-[480px]">
              Get matched with remote jobs, tailored to your unique
              profile
            </p>
          </div>
        }
        userName={personalInfo.fullName}
      >
        <div className="space-y-6 h-full flex flex-col">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Selected Roles:
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Selete all technologies and skills you are good at. You may be
            tested on these later to ensure a good fit with SoftCloudNet.
          </p>

          <div className="space-y-2 max-h-[50vh] overflow-y-scroll non-scrollbar">
            {availableSkills.map((skill) => (
              <SkillItem
                key={skill}
                skill={skill}
                skills={mainSkills}
                setSkills={setMainSkills}
                errors={errors}
              />
            ))}
          </div>

          {errors.skills && (
            <p className="text-xs text-red-600">{errors.skills}</p>
          )}

          <div className="flex justify-between">
            <BackButton />
            <NextButton
              disabled={mainSkills.length == 0}
              onClick={handleSubmit}
            >
              Next
            </NextButton>
          </div>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
