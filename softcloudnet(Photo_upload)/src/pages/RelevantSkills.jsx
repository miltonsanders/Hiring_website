import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useApplicationStore from "../store/applicationStore";
import { BACKEND_API_PATH } from "../config";
import { RELATED_SKILLS } from "../constants";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import SkillItem from "../components/SkillItem";
import LoadingPage from "../components/LoadingPage";

export default function RelevantSkills() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, mainSkills, relevantSkills, setRelevantSkills, personalInfo } =
    useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const availableSkills = [
    ...new Set(mainSkills.flatMap((skill) => RELATED_SKILLS[skill.name] || [])),
  ];

  const validate = () => {
    const newErrors = {};
    relevantSkills.forEach((skill) => {
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
          { relevantSkills, step: "/relevant-skills" }
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
        title="What relevant skills do you have?"
        imageSrc={<></>}
        userName={personalInfo.fullName}
      >
        <div className="space-y-6 min-h-[30vh]">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">Main Skills:</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {mainSkills.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {availableSkills.map((skill) => (
              <SkillItem
                key={skill}
                skill={skill}
                skills={relevantSkills}
                setSkills={setRelevantSkills}
                errors={errors}
              />
            ))}
          </div>
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
