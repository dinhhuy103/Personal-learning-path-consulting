import React, { useState, useEffect } from "react";

import {
  getAllTool,
  getAllSoftSkill,
  getAllKnowledge,
  getAllLanguage,
  getCourseById,
} from "../../api/objectApi";

const LearningObject = () => {
  const [softSkills, setSoftSkills] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [tools, setTools] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState({
    id: "",
    name: "",
    type: "",
  });
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await getAllTool();
        setTools(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSoftSkill = async () => {
      try {
        const response = await getAllSoftSkill();
        setSoftSkills(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchKnowledge = async () => {
      try {
        const response = await getAllKnowledge();
        setKnowledges(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchLanguage = async () => {
      try {
        const response = await getAllLanguage();
        setLanguages(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTool();
    fetchSoftSkill();
    fetchKnowledge();
    fetchLanguage();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      if (selectedRow) {
        try {
          const response = await getCourseById(
            selectedRow.id,
            selectedRow.type
          );
          console.log(response);
          setCourse(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCourse();
  }, [selectedRow]);

  const filteredTools = tools.filter((tool) =>
    tool.Tool_Name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSoftSkills = softSkills.filter((softSkill) =>
    softSkill.Soft_Skill_Name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredKnowledges = knowledges.filter((knowledge) =>
    knowledge.Knowledge_Name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLanguages = languages.filter((language) =>
    language.Language_Name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLearnSkill = () => {
    if (course && course.Course_Link) {
      window.location.href = course.Course_Link;
    }
  };

  return (
    <div className="container">
      <div className="flex my-10 mx-10 justify-center">
        <div className="flex flex-col mr-10 rounded-3xl lg:w-1/2 bg-white">
          <input
            className="w-full max-w-96 px-3 py-2 mx-10 my-5 border-2 outline-cyan-500 rounded-2xl"
            type="text"
            placeholder="Search skill"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="table-container overflow-x-auto h-[386px] max-w-full mx-10 mb-5 bg-white">
            <table className="table-auto">
              <thead className="bg-cyan-400 sticky top-0">
                <tr>
                  <th className="border-x-2 w-[80px]">ID</th>
                  <th className="border-x-2 w-[100px]">Type</th>
                  <th className="border-x-2 w-[350px]">Name</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredTools.map((tool, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === tool.Tool_ID ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: tool.Tool_ID,
                        name: tool.Tool_Name,
                        type: "Tool",
                      })
                    }
                  >
                    <td className="border-2">{tool.Tool_ID}</td>
                    <td className="border-2">Tool</td>
                    <td className="border-2">{tool.Tool_Name}</td>
                  </tr>
                ))}
                {filteredSoftSkills.map((softSkill, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === softSkill.Soft_Skill_ID
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: softSkill.Soft_Skill_ID,
                        name: softSkill.Soft_Skill_Name,
                        type: "Soft Skill",
                      })
                    }
                  >
                    <td className="border-2">{softSkill.Soft_Skill_ID}</td>
                    <td className="border-2">Soft Skill</td>
                    <td className="border-2">{softSkill.Soft_Skill_Name}</td>
                  </tr>
                ))}
                {filteredKnowledges.map((knowledge, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === knowledge.Knowledge_ID
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: knowledge.Knowledge_ID,
                        name: knowledge.Knowledge_Name,
                        type: "Knowledge",
                      })
                    }
                  >
                    <td className="border-2">{knowledge.Knowledge_ID}</td>
                    <td className="border-2">Knowledge</td>
                    <td className="border-2">{knowledge.Knowledge_Name}</td>
                  </tr>
                ))}
                {filteredLanguages.map((language, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === language.Language_ID
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: language.Language_ID,
                        name: language.Language_Name,
                        type: "Language",
                      })
                    }
                  >
                    <td className="border-2">{language.Language_ID}</td>
                    <td className="border-2">Language</td>
                    <td className="border-2">{language.Language_Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col w-full rounded-3xl lg:w-1/2">
          <div className="flex flex w-full mr-10 mb-10 rounded-3xl bg-white">
            <div className="flex flex-col mx-10 justify-center">
              <p className="py-2 font-bold">Skill ID:</p>
              <p className="py-2 font-bold">Skill title:</p>
              <p className="py-2 font-bold">Type:</p>
            </div>

            <div className="flex flex-col my-10 justify-center">
              <p className="py-2">{selectedRow.id}</p>
              <p className="py-2">{selectedRow.name}</p>
              <p className="py-2">{selectedRow.type}</p>
            </div>
          </div>

          <div className="flex flex-col w-full rounded-3xl bg-white">
            <div className="mx-5">
              <p className="font-bold text-2xl">Taught by Courses</p>
            </div>
            <div className="flex mx-10 my-3">
              {course ? (
                  <div className="flex justify-center items-center mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal">
                    <p className="truncate" title={course.Course_Name}>{course.Course_Name}</p>
                  </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex w-full h-10 m-4 justify-center items-center">
            <button className="border-2 bg-green-600 px-3 py-2 text-white" onClick={handleLearnSkill}>
              Learn this skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningObject;
