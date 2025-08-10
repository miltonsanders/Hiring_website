// // src/pages/BusinessType.jsx
// import { useNavigate } from "react-router-dom";
// import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
// import useApplicationStore from "../store/applicationStore";
// import Layout from "../components/Layout";
// import NextButton from "../components/NextButton";

// export default function BusinessType() {
//   const navigate = useNavigate();
//   const { businessType, setBusinessType } = useApplicationStore();

//   const handleContinue = () => {
//     navigate("/location");
//   };

//   return (
//     <Layout
//       title="Select Your Business Type"
//       description="Please choose whether you're applying as an individual or company"
//     >
//       <div className="space-y-6 max-w-lg">
//         <div className="space-y-4">
//           <div>
//             <input
//               type="radio"
//               name="businessType"
//               value="p2p"
//               id="businessType-p2p"
//               checked={businessType === "p2p"}
//               onChange={() => setBusinessType("p2p")}
//               className="hidden"
//             />
//             <label
//               htmlFor="businessType-p2p"
//               className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
//             >
//               {businessType === "p2p" ? (
//                 <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
//               ) : (
//                 <MinusCircleIcon className="w-6 h-6 text-gray-400" />
//               )}
//               <div>
//                 <h3 className="font-medium">Individual (P2P)</h3>
//                 <p className="text-sm text-gray-500">
//                   I'm applying as an individual freelancer or contractor
//                 </p>
//               </div>
//             </label>
//           </div>

//           <div>
//             <input
//               type="radio"
//               name="businessType"
//               value="b2b"
//               id="businessType-b2b"
//               checked={businessType === "b2b"}
//               onChange={() => setBusinessType("b2b")}
//               className="hidden"
//             />
//             <label
//               htmlFor="businessType-b2b"
//               className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
//             >
//               {businessType === "b2b" ? (
//                 <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
//               ) : (
//                 <MinusCircleIcon className="w-6 h-6 text-gray-400" />
//               )}
//               <div>
//                 <h3 className="font-medium">Company (B2B)</h3>
//                 <p className="text-sm text-gray-500">
//                   I'm applying on behalf of a company or organization
//                 </p>
//               </div>
//             </label>
//           </div>
//         </div>

//         <NextButton
//           onClick={handleContinue}
//           disabled={!businessType}
//         >
//           Continue
//         </NextButton>
//       </div>
//     </Layout>
//   );
// }

import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import useApplicationStore from "../store/applicationStore";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "../components/Image";
import BackButton from "../components/BackButton";

export default function BusinessType() {
  const navigate = useNavigate();
  const { businessType, setBusinessType } = useApplicationStore();

  const handleContinue = () => {
    navigate("/location");
  };

  const handleBack = () => {
    navigate("/")
  }

  return (
    <Layout
      title="Select Your Business Type"
      
      imageSrc={
        <div className="p-8 text-white">
          <div className="mb-8">
            <Image
              alt="Business type selection"
              src="/images/business-type-illustration.png"
              className="max-w-xs mx-auto"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Understanding Your Business Type</h3>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="font-medium mb-2">Why does this matter?</h4>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-300">•</span>
                  <span>Determines available opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-300">•</span>
                  <span>Affects contract requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-300">•</span>
                  <span>Customizes your application flow</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Are you applying as:</h2>

          <div className="space-y-4">
            <div>
              <input
                type="radio"
                name="businessType"
                value="p2p"
                id="businessType-p2p"
                checked={businessType === "p2p"}
                onChange={() => setBusinessType("p2p")}
                className="hidden"
              />
              <label
                htmlFor="businessType-p2p"
                className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {businessType === "p2p" ? (
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                ) : (
                  <MinusCircleIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium">Individual (P2P)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    I'm applying as an individual freelancer or contractor
                  </p>
                </div>
              </label>
            </div>

            <div>
              <input
                type="radio"
                name="businessType"
                value="b2b"
                id="businessType-b2b"
                checked={businessType === "b2b"}
                onChange={() => setBusinessType("b2b")}
                className="hidden"
              />
              <label
                htmlFor="businessType-b2b"
                className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {businessType === "b2b" ? (
                  <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                ) : (
                  <MinusCircleIcon className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h3 className="font-medium">Company (B2B)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    I'm applying on behalf of a company or organization
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <BackButton
            onClick={handleBack}
          >
            Back
          </BackButton>
          <NextButton
            onClick={handleContinue}
            disabled={!businessType}
          >
            Next
          </NextButton>
        </div>
      </div>
    </Layout>
  );
}