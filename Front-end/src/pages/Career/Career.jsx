import React, { useState, useEffect } from "react";

import {
  getAllCareer,
  getNeedSkill,
  getLearningPath,
} from "../../api/objectApi";

import { FaArrowRight } from "react-icons/fa6";

const Career = () => {
  const [careers, setCareers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState({
    id: "",
    title: "",
  });
  const [tools, setTools] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [filter, setFilter] = useState("All");
  const [learning, setLearning] = useState([]);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await getAllCareer();
        setCareers(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCareer();
  }, []);

  useEffect(() => {
    const fetchNeedSkill = async () => {
      if (selectedRow) {
        try {
          const response = await getNeedSkill(selectedRow.id);
          setTools(response.data.tools);
          setSoftSkills(response.data.soft_skills);
          setKnowledges(response.data.knowledges);
          setLanguages(response.data.languages);
          setLearning([]);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchNeedSkill();
  }, [selectedRow]);

  const handleGetLearningPath = async () => {
    if (selectedRow) {
      try {
        const response = await getLearningPath(selectedRow.id);
        console.log(response);
        setLearning(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredCareer = careers.filter((career) =>
    career.Career_Name.toLowerCase().includes(search.toLowerCase())
  );

  const renderNeedSkills = () => {
    switch (filter) {
      case "Tools":
        return tools.map((tool, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={tool}>
              {tool}
            </p>
          </div>
        ));
      case "Soft Skills":
        return softSkills.map((softSkill, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={softSkill}>
              {softSkill}
            </p>
          </div>
        ));
      case "Knowledges":
        return knowledges.map((knowledge, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={knowledge}>
              {knowledge}
            </p>
          </div>
        ));
      case "Languages":
        return languages.map((language, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={language}>
              {language}
            </p>
          </div>
        ));
      case "All":
      default:
        return (
          <>
            {tools.map((tool, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={tool}>
                  {tool}
                </p>
              </div>
            ))}
            {softSkills.map((softSkill, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={softSkill}>
                  {softSkill}
                </p>
              </div>
            ))}
            {knowledges.map((knowledge, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={knowledge}>
                  {knowledge}
                </p>
              </div>
            ))}
            {languages.map((language, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={language}>
                  {language}
                </p>
              </div>
            ))}
          </>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex my-10 mx-10 justify-around">
        <div className="flex flex-col mr-10 rounded-3xl w-[800px] bg-white">
          <input
            className="w-full max-w-96 px-3 py-2 mx-10 my-5 border-2 outline-cyan-500 rounded-2xl"
            type="text"
            placeholder="Search career"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="table-container overflow-x-auto h-[386px] max-w-full mx-10 mb-5 bg-white">
            <table className="table-auto">
              <thead className="bg-cyan-400 sticky top-0">
                <tr>
                  <th className="border-x-2 w-[80px]">ID</th>
                  <th className="border-x-2 w-[500px]">Title</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredCareer.map((career, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === career.Career_ID ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: career.Career_ID,
                        title: career.Career_Name,
                      })
                    }
                  >
                    <td className="border-2">{career.Career_ID}</td>
                    <td className="border-2">{career.Career_Name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl w-[1000px] bg-white">
          <div className="w-full">
            <div className="flex flex-row mx-5 my-2">
              <p className="font-bold text-2xl mr-9">Need skills</p>
              <select
                className="basis-1/2 px-3 border-2 rounded-2xl"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Tools">Tools</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Knowledges">Knowledges</option>
                <option value="Languages">Languages</option>
              </select>
            </div>
            <div className="flex flex-wrap mx-10 my-3">
              {renderNeedSkills()}
            </div>
          </div>

          <div className="w-full">
            <div className="mx-5">
              <p className="font-bold text-2xl">Learning path</p>
            </div>
            <div className="flex flex-wrap mx-10 my-3">
              {learning ? (
                <>
                  {learning.map(
                    (item, index) =>
                      item.Course_Name !== null && (
                        <>
                          <div
                            key={index}
                            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-violet-200 text-[14px] p-2 text-center whitespace-normal"
                          >
                            <p className="truncate" title={item.Course_Name}>
                              {item.Course_Name}
                            </p>
                          </div>
                          {index !== learning.length - 2 && (
                            <div className="flex justify-center items-center mb-2 mr-2 w-4 h-20 text-black text-[14px] text-center">
                              <FaArrowRight />
                            </div>
                          )}
                        </>
                      )
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex w-full h-10 m-4 justify-center items-center mt-auto">
            <button
              className="border-2 bg-green-600 px-3 py-2 text-white"
              onClick={handleGetLearningPath}
            >
              Get Learning Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
