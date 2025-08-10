import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { Switch } from "@headlessui/react";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import useApplicationStore from "../store/applicationStore";
import { BACKEND_API_PATH } from "../config";
import { useToast } from "../contexts/ToastContext";
import Layout from "../components/Layout";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import LoadingPage from "../components/LoadingPage";
import Image from "../components/Image";

export default function Location() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { token, location, setLocation, personalInfo, businessType } = useApplicationStore();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [countryId, setCountryId] = useState(0);
  const [stateId, setStateId] = useState(0);
  const [cityId, setCityId] = useState(0);

  const validate = () => {
    const newErrors = {};
    if (!location.country) newErrors.country = "Please select your country";

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
          {
            location_country: location.country,
            location_state: location.state,
            location_city: location.city,
            location_isMoving: location.isMoving,
            step: "/location",
          }
        );
        if (response.data.application && businessType === "b2b") {
          navigate("/links");
        } else {
          navigate("/monthly-rate")
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
        title="Where are you based?"
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 min-h-[40vh]">
            <div className="max-w-[512px] space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <CountrySelect
                onChange={(e) => {
                  setCountryId(e.id);
                  setStateId(0);
                  setCityId(0);
                  setLocation({ country: e.name, state: "", city: "" });
                }}
                placeHolder="Select Country"
                inputClassName="mt-1 text-black bg-white"
                required
              />
            </div>
            {countryId != 0 && (
              <div className="max-w-[512px] space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <StateSelect
                  countryid={countryId}
                  onChange={(e) => {
                    setStateId(e.id);
                    setCityId(0);
                    setLocation({ state: e.name, city: "" });
                  }}
                  placeHolder="Select State"
                  inputClassName="mt-1 text-black bg-white"
                />
              </div>
            )}
            {stateId != 0 && (
              <div className="max-w-[512px] space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <CitySelect
                  countryid={countryId}
                  stateid={stateId}
                  onChange={(e) => {
                    setCityId(e.id);
                    setLocation({ city: e.name });
                  }}
                  placeHolder="Select City"
                  inputClassName="mt-1 text-black bg-white"
                />
              </div>
            )}
            <div
              className={clsx({
                visible: location.country,
                hidden: !location.country,
              })}
            >
              <input
                type="checkbox"
                id="input-checkbox-location-ismoving"
                checked={location.isMoving}
                onChange={(e) => setLocation({ isMoving: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                hidden
              />
              <label
                className="text-sm text-gray-700 flex items-center gap-2 select-none"
                htmlFor="input-checkbox-location-ismoving"
              >
                <Switch
                  checked={location.isMoving}
                  onChange={(e) =>
                    setLocation({ isMoving: !location.isMoving })
                  }
                  className="group relative flex h-5 w-8 min-w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                      {
                        "bg-indigo-700": location.isMoving,
                        "bg-indigo-50 border border-indigo-400":
                          !location.isMoving,
                      }
                    )}
                  />
                </Switch>
                I am moving to a different timezone in the next 6 months
              </label>
            </div>
          </div>

          <div className="flex justify-between">
            <BackButton />
            <NextButton type={"submit"}>Next</NextButton>
          </div>
        </form>
      </Layout>
      {submitting && <LoadingPage />}
    </>
  );
}
