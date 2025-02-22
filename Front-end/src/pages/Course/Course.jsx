import React, { useState, useEffect } from "react";

import { getAllCourse, getPrerequisiteSkill, getTeachSkill } from "../../api/objectApi";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState({
    id: "",
    title: "",
    duration: "",
    link: "",
  });
  const [tools, setTools] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [filter, setFilter] = useState("All");
  const [teachTools, setTeachTools] = useState([]);
  const [teachSoftSkills, setTeachSoftSkills] = useState([]);
  const [teachKnowledges, setTeachKnowledges] = useState([]);
  const [teachLanguages, setTeachLanguages] = useState([]);
  const [teachFilter, setTeachFilter] = useState("All");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getAllCourse();
        setCourses(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourse();
  }, []);

  useEffect(() => {
    const fetchPrerequisiteSkill = async () => {
      if (selectedRow) {
        try {
          const response = await getPrerequisiteSkill(selectedRow.id);
          setTools(response.data.tools);
          setSoftSkills(response.data.soft_skills);
          setKnowledges(response.data.knowledges);
          setLanguages(response.data.languages);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchPrerequisiteSkill();
  }, [selectedRow]);

  useEffect(() => {
    const fetchTeachSkill = async () => {
      if (selectedRow) {
        try {
          const response = await getTeachSkill(selectedRow.id);
          setTeachTools(response.data.tools);
          setTeachSoftSkills(response.data.soft_skills);
          setTeachKnowledges(response.data.knowledges);
          setTeachLanguages(response.data.languages);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchTeachSkill();
  }, [selectedRow]);

  const filteredCourse = courses.filter((course) =>
    course.Course_Name.toLowerCase().includes(search.toLowerCase())
  );

  const renderPrerequisiteSkills = () => {
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

  const renderTeachSkills = () => {
    switch (teachFilter) {
      case "Tools":
        return teachTools.map((tool, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={tool}>
              {tool}
            </p>
          </div>
        ));
      case "Soft Skills":
        return teachSoftSkills.map((softSkill, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={softSkill}>
              {softSkill}
            </p>
          </div>
        ));
      case "Knowledges":
        return teachKnowledges.map((knowledge, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
          >
            <p className="truncate" title={knowledge}>
              {knowledge}
            </p>
          </div>
        ));
      case "Languages":
        return teachLanguages.map((language, index) => (
          <div
            key={index}
            className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
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
            {teachTools.map((tool, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={tool}>
                  {tool}
                </p>
              </div>
            ))}
            {teachSoftSkills.map((softSkill, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={softSkill}>
                  {softSkill}
                </p>
              </div>
            ))}
            {teachKnowledges.map((knowledge, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
              >
                <p className="truncate" title={knowledge}>
                  {knowledge}
                </p>
              </div>
            ))}
            {teachLanguages.map((language, index) => (
              <div
                key={index}
                className="flex justify-center items-center mb-2 mr-2 w-20 h-20 rounded-full bg-red-200 text-[14px] p-2 text-center whitespace-normal"
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

  const handleLearnSkill = () => {
    if (selectedRow && selectedRow.link) {
      window.location.href = selectedRow.link;
    }
  }; 

  return (
    <div className="container">
      <div className="flex my-10 mx-10 justify-center">
        <div className="flex flex-col mr-10 rounded-3xl lg:w-1/2 bg-white">
          <input
            className="w-full max-w-96 px-3 py-2 mx-10 my-5 border-2 outline-cyan-500 rounded-2xl"
            type="text"
            placeholder="Search course"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="table-container overflow-x-auto h-[386px] max-w-full mx-10 mb-5 bg-white">
            <table className="table-auto">
              <thead className="bg-cyan-400 sticky top-0">
                <tr>
                  <th className="border-x-2 w-[80px]">ID</th>
                  <th className="border-x-2 w-[350px]">Title</th>
                  <th className="border-x-2 w-[150px]">Duration</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredCourse.map((course, index) => (
                  <tr
                    key={index}
                    className={`border-2 cursor-pointer ${
                      selectedRow.id === course.Course_ID ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      setSelectedRow({
                        id: course.Course_ID,
                        title: course.Course_Name,
                        duration: course.Course_Duration,
                        link: course.Course_Link,
                      })
                    }
                  >
                    <td className="border-2">{course.Course_ID}</td>
                    <td className="border-2">{course.Course_Name}</td>
                    <td className="border-2">{course.Course_Duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl lg:w-1/2 bg-white">
          <div className="w-full">
            <div className="flex flex-row mx-5 my-2">
              <p className="font-bold text-2xl mr-9">Prerequisite skills</p>
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
              {renderPrerequisiteSkills()}
            </div>
          </div>

          <div className="w-full">
            <div className="flex flex-row mx-5 my-2">
              <p className="font-bold text-2xl mr-28">Teach skills</p>
              <select
                className="basis-1/2 px-3 border-2 rounded-2xl"
                value={teachFilter}
                onChange={(e) => setTeachFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Tools">Tools</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Knowledges">Knowledges</option>
                <option value="Languages">Languages</option>
              </select>
            </div>
            <div className="flex flex-wrap mx-10 my-3">
              {renderTeachSkills()}
            </div>
          </div>

          <div className="flex w-full h-10 m-4 justify-center items-center mt-auto">
            <button className="border-2 bg-green-600 px-3 py-2 text-white" onClick={handleLearnSkill}>
              Learn this course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
