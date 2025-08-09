import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApplicationStore from "../store/applicationStore";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";

const x = {
  code: "rate-limited",
  message:
    'You have hit the rate limit. Please <a class="__boltUpgradePlan__">Upgrade</a> to keep chatting, or you can continue coding for free in the editor.',
  providerLimitHit: false,
  isRetryable: true,
};

const Availability = () => {
  const navigate = useNavigate();
  const { personalInfo } = useApplicationStore();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/links");
  };

  return (
    <Layout
      title="What's your English level?"
      imageSrc="/english-image.jpg"
      userName={personalInfo.fullName}
    >
      <div className="space-y-6">
        <div className="space-y-4"></div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-between">
          <BackButton />
          <NextButton onClick={handleSubmit}>Next</NextButton>
        </div>
      </div>
    </Layout>
  );
};

export default Availability;
