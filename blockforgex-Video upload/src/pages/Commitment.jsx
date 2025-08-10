import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { Switch } from "@headlessui/react";
import useApplicationStore from "../store/applicationStore";
import { BACKEND_API_PATH } from "../config";
import { COMMITMENT_TYPE } from "../constants";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

export default function Commitment() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, commitment, setCommitment, personalInfo } =
    useApplicationStore();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (commitment.length === 0) {
        setError("Please select at least one commitment type");
        return;
      }
      setSubmitting(true);
      const response = await axios.put(
        `${BACKEND_API_PATH}/applications/token/${token}`,
        { commitment, step: "/commitment" }
      );
      if (response.data.application) {
        navigate("/english-level");
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

  const toggleCommitment = (id) => {
    if (commitment.includes(id)) {
      setCommitment(commitment.filter((c) => c !== id));
    } else {
      setCommitment([...commitment, id]);
    }
  };

  return (
    <>
      <Layout
        title="What type of commitment do you prefer?"
        imageSrc={
          <>
            <div className="flex justify-center mb-10">
              <Image
                alt="information"
                src="/images/commitment.fc5dbce.png"
                className="w-40 h-40"
              />
            </div>
            <div className="mx-20">
              <p className="text-white text-center text-3xl font-semibold">
                Create more impact with a full-time commitment
              </p>
            </div>
          </>
        }
        userName={personalInfo.fullName}
      >
        <div className="space-y-6">
          <div className="space-y-4 min-h-[40vh]">
            {COMMITMENT_TYPE.map((type) => (
              <div
                key={type.id}
                className="relative flex items-center p-4 border rounded-lg hover:bg-gray-50 select-none"
                onClick={() => toggleCommitment(type.id)}
              >
                <input
                  type="checkbox"
                  checked={commitment.includes(type.id)}
                  onChange={() => toggleCommitment(type.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  hidden
                />
                <Switch
                  checked={commitment.includes(type.id)}
                  className="group relative flex h-5 w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                      {
                        "bg-indigo-700": commitment.includes(type.id),
                        "bg-indigo-50 border border-indigo-400":
                          !commitment.includes(type.id),
                      }
                    )}
                  />
                </Switch>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">
                    {type.label}
                  </label>
                  <p className="text-gray-500">{type.description}</p>
                </div>
              </div>
            ))}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <div className="flex justify-between">
            <BackButton />
            <NextButton onClick={handleSubmit}>Next</NextButton>
          </div>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
