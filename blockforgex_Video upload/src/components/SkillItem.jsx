import { useCallback, useState } from "react";
import clsx from "clsx";
import { Switch } from "@headlessui/react";
import Input from "./Input";

const SkillItem = ({ skill, skills, setSkills, errors }) => {
  const [expandedSkill, setExpandedSkill] = useState(false);

  const handleSkillChange = useCallback(
    (skill, data) => {
      setSkills(skills.map((s) => (s.name === skill ? { ...s, ...data } : s)));
    },
    [setSkills, skills]
  );

  const toggleSkill = useCallback(
    (skill) => {
      if (skills.find((s) => s.name === skill)) {
        setSkills(skills.filter((s) => s.name !== skill));
      } else {
        setSkills([...skills, { name: skill, years: 0, level: "beginner" }]);
      }
    },
    [skills, setSkills]
  );

  const handleExpend = useCallback(() => {
    if (skills.some((s) => s.name === skill)) setExpandedSkill(!expandedSkill);
    else {
      setSkills([...skills, { name: skill, years: 0, level: "beginner" }]);
      setExpandedSkill(true);
    }
  }, [expandedSkill, skills, skill]);

  const handleInputChange = useCallback(() => {
    if (!skills.some((s) => s.name === skill)) setExpandedSkill(true);
    toggleSkill(skill);
  }, [toggleSkill, skills, skill]);

  return (
    <div
      className={clsx("border rounded-xl overflow-hidden", {
        "border-indigo-600": skills.some((s) => s.name === skill),
        "border-indigo-200": !skills.some((s) => s.name === skill),
      })}
    >
      <div
        className="flex items-center justify-between px-4 py-4 cursor-pointer bg-white"
        onClick={handleExpend}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={skills.some((s) => s.name === skill)}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 select-none"
            onClick={(e) => e.stopPropagation()}
            hidden
          />
          <Switch
            checked={skills.some((s) => s.name === skill)}
            onChange={handleInputChange}
            className="group relative flex h-5 w-8 cursor-pointer rounded-full bg-white/10 border border-gray-400 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none inline-block size-3.5 translate-x-0 rounded-full ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-3",
                {
                  "bg-indigo-700": skills.some((s) => s.name === skill),
                  "bg-indigo-50 border border-indigo-400": !skills.some(
                    (s) => s.name === skill
                  ),
                }
              )}
            />
          </Switch>
          <span className="font-medium text-black">{skill}</span>
          {errors[`${skill}-years`] && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transform transition-transform ${
            expandedSkill ? "rotate-180" : ""
          }`}
          fill="#4338ca"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {expandedSkill && skills.some((s) => s.name === skill) && (
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 space-x-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Years of Experience
              </label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={skills.find((s) => s.name === skill)?.years}
                onChange={(e) => {
                  handleSkillChange(skill, {
                    years: parseFloat(e.target.value),
                  });
                }}
              />
              {errors[`${skill}-years`] && (
                <p className="mt-2 text-xs text-red-600">
                  {errors[`${skill}-years`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Skill Level
              </label>
              <select
                value={
                  skills.find((s) => s.name === skill)?.level || "beginner"
                }
                onChange={(e) =>
                  handleSkillChange(skill, { level: e.target.value })
                }
                className="mt-1 block w-full rounded-md focus:border-indigo-400 focus:ring-indigo-500 sm:text-sm p-3 bg-transparent text-black outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillItem;
