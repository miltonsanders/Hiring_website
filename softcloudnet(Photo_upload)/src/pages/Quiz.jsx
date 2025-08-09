import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";
import {
  ArrowPathIcon,
  ChatBubbleBottomCenterIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import useApplicationStore from "../store/applicationStore";
import { getQuestions } from "../constants/quiz";
import { useToast } from "../contexts/ToastContext";
import { BACKEND_API_PATH } from "../config";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import LoadingPage from "../components/LoadingPage";
import Button from "../components/Button";

export default function Quiz() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, selectedRoles, mainSkills, personalInfo } =
    useApplicationStore();
  const editorRef = useRef(null);
  const [quizAnswers, addQuizAnswer] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittingError, setSubmittingError] = useState(false);
  const [questions] = useState(() =>
    getQuestions(selectedRoles, mainSkills, 3)
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log(event);
      event.preventDefault();
      event.returnValue = "";
    };

    const handleKeyDown = (event) => {
      if ((event.ctrlKey && event.key === "r") || event.key === "F5") {
        event.preventDefault();
        alert(
          "Warning: Reloading will cause you to lose your progress. Please save your work before refreshing."
        );
      }
    };

    const preventGoBack = () => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);

    window.addEventListener("popstate", preventGoBack);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          navigate("/video-intro");
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = useCallback(
    async (e) => {
      try {
        if (e) e.preventDefault();
        setSubmitting(true);
        const response = await axios.post(
          `${BACKEND_API_PATH}/quizs/token/${token}`,
          { quizAnswers }
        );
        if (response.data.quizs) {
          await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
            step: "/video-intro",
          });
          setTimeout(() => {
            setSubmitting(false);
            navigate("/video-intro");
          }, Math.random() * 500 + 1500);
        }
      } catch (error) {
        console.log(error);
        setSubmittingError(true);
        addToast({
          message: `Unexpected server error. Please try it later.`,
          type: "warn",
        });
      } finally {
        setLoading(false);
      }
    },
    [navigate, addToast, token, quizAnswers]
  );

  const handleSubmit1 = async (newQuizzes) => {
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${BACKEND_API_PATH}/quizs/token/${token}`,
        { quizAnswers: newQuizzes }
      );
      if (response.data.quizs) {
        await axios.put(`${BACKEND_API_PATH}/applications/token/${token}`, {
          step: "/video-intro",
        });
        setTimeout(() => {
          setSubmitting(false);
          navigate("/video-intro");
        }, Math.random() * 500 + 1500);
      }
    } catch (error) {
      console.log(error);
      setSubmittingError(true);
      addToast({
        message: `Unexpected server error. Please try it later.`,
        type: "warn",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (editorRef.current) {
      setLoading(true);
      const newQuizzes = [
        ...quizAnswers,
        {
          count: currentQuestion,
          answer: editorRef.current.getContent(),
        },
      ];
      addQuizAnswer(newQuizzes);

      if (currentQuestion >= questions.length - 1) {
        setTimeout(() => {
          handleSubmit1(newQuizzes);
        }, 300);
      } else {
        setTimeout(() => {
          editorRef.current.setContent("");
          setCurrentQuestion(currentQuestion + 1);
          setLoading(false);
        }, Math.random() * 500 + 500);
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (timeLeft == 0) {
      handleSubmit();
    }
  }, [handleSubmit, timeLeft]);

  return (
    <>
      <Layout userName={personalInfo.fullName}>
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-full flex items-center gap-4">
              <span className="text-sm font-medium text-white bg-gray-700 px-2 py-1 rounded-lg text-nowrap">
                {questions.length - currentQuestion} questions to go
              </span>
              <div className="w-full h-4 bg-gray-200 rounded-full">
                <div
                  className="w-0 h-4 bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text font-medium text-indigo-500 bg-indigo-200 px-2 rounded-full text-nowrap flex items-center gap-2">
              {formatTime(timeLeft)}
              <ClockIcon className="size-4" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {questions[currentQuestion]?.question}
            </h2>
            <div className="space-y-4 ">
              {questions[currentQuestion]?.options.map((option, index) => (
                <div key={index}>
                  <p className="text-sm font-medium text-gray-900">
                    - {option}
                  </p>
                </div>
              ))}
            </div>
            <div className="pt-6 space-y-2">
              <div className="text-black flex items-center gap-2">
                <ChatBubbleBottomCenterIcon className="size-4" /> Answer
              </div>
              <Editor
                apiKey="nq01zqvcxlg728xe33qqggtq4xjtqj5j8b1xvj9hlf5lnfxn"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue=""
                init={{
                  height: "40vh",
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <NextButton
              onClick={handleNext}
              className={"flex items-center gap-2"}
            >
              Next
              {loading && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </NextButton>
          </div>
        </div>
      </Layout>
      {submitting && <LoadingPage />}
      {submitting && (
        <div className="z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center transition-all">
          <div className="w-96 p-2 bg-gray-50 border border-gray-300 shadow shadow-gray-300 relative text-[#000C] space-y-4 animate-toastIn rounded-xl">
            {!submittingError && (
              <>
                <p className="text-center text-lg font-bold text-[#000e]">
                  Uploading results...
                </p>
                <p className="text-center">
                  You will receive an email about the result.
                </p>
              </>
            )}
            {submittingError && (
              <p className="text-center">
                Unexcepted error while uploading results
              </p>
            )}
            <div className="flex justify-center gap-2">
              <Button
                className={"!p-3 min-w-[160px] !text-md"}
                onClick={handleSubmit}
                disabled={!submittingError}
                varient={"fill"}
              >
                <ArrowPathIcon className="size-4" />
                Upload Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
