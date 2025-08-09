import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import useApplicationStore from "../store/applicationStore";
import { ROLES } from "../constants";
import { useToast } from "../contexts/ToastContext";
import { BACKEND_API_PATH } from "../config";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

export default function RoleSelection() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, selectedRoles, setSelectedRoles, personalInfo } =
    useApplicationStore();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) setSelectedRoles([]);
    else setSelectedRoles([roleId]);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (selectedRoles.length === 0) {
        setError("Please select at least one role");
        return;
      }
      setSubmitting(true);
      const response = await axios.put(
        `${BACKEND_API_PATH}/applications/token/${token}`,
        { selectedRoles, step: "/role-selection" }
      );
      if (response.data.application) {
        navigate("/main-skills");
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
        title="What's your main role?"
        imageSrc={
          <>
            <div className="flex justify-center mb-10">
              <Image
                alt="information"
                src="/images/core_competencies.b98fc6f.png"
                className="w-40 h-40"
              />
            </div>
            <div className="mx-20">
              <p className="text-white text-center text-3xl font-semibold">
                Jobs tailored for you
              </p>
              <p className="mt-4 text-white text-center">
                After joining the network, you gain access to top jobs that
                match your skills and experience.
              </p>
            </div>
          </>
        }
        userName={personalInfo.fullName}
      >
        <div className="space-y-6">
          <div className="min-h-[40vh]">
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleToggle(role.id)}
                  className={clsx(
                    "bg-white px-4 py-2 rounded-full text-sm font-medium transition-colors !outline-none",
                    "border-2",
                    selectedRoles.includes(role.id)
                      ? "!bg-indigo-600 text-white"
                      : "border-gray-400 text-gray-700 hover:border-gray-300"
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex justify-between">
            <BackButton />
            <NextButton
              disabled={selectedRoles.length == 0}
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
