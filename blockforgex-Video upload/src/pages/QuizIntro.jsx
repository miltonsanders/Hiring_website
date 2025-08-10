import { useNavigate } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/outline";
import useApplicationStore from "../store/applicationStore";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import Image from "../components/Image";

export default function QuizIntro() {
  const navigate = useNavigate();
  const { selectedRoles, mainSkills, personalInfo } = useApplicationStore();

  const getQuizTitle = () => {
    if (selectedRoles.includes("blockchain")) return "Blockchain Development";
    if (selectedRoles.includes("frontend")) return "Frontend Development";
    if (selectedRoles.includes("backend")) return "Backend Development";
    return "Technical Assessment";
  };

  return (
    <Layout
      title={`${getQuizTitle()} Quiz`}
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
        <div className="flex items-center justify-between gap-4">
          <div className="w-full flex items-center gap-4">
            <span className="text-sm font-medium text-white bg-gray-700 px-2 py-1 rounded-lg text-nowrap">
              3 questions to go
            </span>
            <div className="w-full h-4 bg-gray-200 rounded-full">
              <div className="w-0 h-4 bg-indigo-600 rounded-full"></div>
            </div>
          </div>
          <div className="text font-medium text-indigo-500 bg-indigo-200 px-2 rounded-full text-nowrap flex items-center gap-2">
            10:00
            <ClockIcon className="size-4" />
          </div>
        </div>
        <p className="text-center text-gray-700">
          You've almost completed the application form
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Technical Assessment: {getQuizTitle()}
          </h2>
          <div className="prose prose-sm text-gray-500">
            {/* <p>This quiz will test your knowledge in:</p>
            <ul className="list-disc pl-5 mt-2">
              {mainSkills.map((skill) => (
                <li key={skill.name}>{skill.name}</li>
              ))}
            </ul> */}
            <p className="mt-4">Important information:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>You have 10 minutes to complete all questions</li>
              <li>You cannot go back to previous questions</li>
              <li>The timer will start when you begin the quiz</li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between">
          <BackButton />
          <NextButton onClick={() => navigate("/quiz")} className={"!px-6"}>
            Start QUIZ
          </NextButton>
        </div>
      </div>
    </Layout>
  );
}
