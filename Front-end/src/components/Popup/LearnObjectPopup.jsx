import React, { useState, useEffect, useContext } from "react";
import { LearnerContext } from "../../components/Context/LearnerContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  getAllTool,
  getAllSoftSkill,
  getAllKnowledge,
  getAllLanguage,
} from "../../api/objectApi";
import { UpdateLearnerKnowObject } from "../../api/userApi";


const LearnObjectPopup = ({ open, onClose, knowItemsTools, knowItemsSoftSkills, knowItemsKnowledges, knowItemsLanguages }) => {
  const [softSkills, setSoftSkills] = useState([]);
  const [knowledges, setKnowledges] = useState([]);
  const [tools, setTools] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [selectedSoftSkills, setSelectedSoftSkills] = useState([]);
  const [selectedKnowledges, setSelectedKnowledges] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const { learner, setLearner } = useContext(LearnerContext);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const softSkillResponse = await getAllSoftSkill();
        setSoftSkills(softSkillResponse.data);

        const knowledgeResponse = await getAllKnowledge();
        setKnowledges(knowledgeResponse.data);

        const toolResponse = await getAllTool();
        setTools(toolResponse.data);

        const languageResponse = await getAllLanguage();
        setLanguages(languageResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (knowItemsTools) {
      const selectedToolsObjects = knowItemsTools.map(item => {
        const toolObject = tools.find(tool => tool.Tool_Name === item);
        return toolObject;
      });
  
      setSelectedTools(selectedToolsObjects);
    }
  }, [knowItemsTools, tools]);

  useEffect(() => {
    if (knowItemsSoftSkills) {
      const selectedSoftSkillsObjects = knowItemsSoftSkills.map(item => {
        const softSkillObject = softSkills.find(softSkill => softSkill.Soft_Skill_Name === item);
        return softSkillObject;
      });
  
      setSelectedSoftSkills(selectedSoftSkillsObjects);
    }
  }, [knowItemsSoftSkills, softSkills]);

  useEffect(() => {
    if (knowItemsKnowledges) {
      const selectedKnowledgesObjects = knowItemsKnowledges.map(item => {
        const knowledgeObject = knowledges.find(knowledge => knowledge.Knowledge_Name === item);
        return knowledgeObject;
      });
  
      setSelectedKnowledges(selectedKnowledgesObjects);
    }
  }, [knowItemsKnowledges, knowledges]);

  useEffect(() => {
    if (knowItemsLanguages) {
      const selectedLanguagesObjects = knowItemsLanguages.map(item => {
        const languageObject = languages.find(language => language.Language_Name === item);
        return languageObject;
      });
  
      setSelectedLanguages(selectedLanguagesObjects);
    }
  }, [knowItemsLanguages, languages]);

  const handleItemClick = (item, type) => {
    switch (type) {
      case "tools":
        if (selectedTools.includes(item)) {
          setSelectedTools((prevSelectedTools) =>
            prevSelectedTools.filter((tool) => tool !== item)
          );
        } else {
          setSelectedTools((prevSelectedTools) => [...prevSelectedTools, item]);
        }
        break;
      case "soft_skills":
        if (selectedSoftSkills.includes(item)) {
          setSelectedSoftSkills((prevSelectedSoftSkills) =>
            prevSelectedSoftSkills.filter((skill) => skill !== item)
          );
        } else {
          setSelectedSoftSkills((prevSelectedSoftSkills) => [
            ...prevSelectedSoftSkills,
            item,
          ]);
        }
        break;
      case "knowledges":
        if (selectedKnowledges.includes(item)) {
          setSelectedKnowledges((prevSelectedKnowledges) =>
            prevSelectedKnowledges.filter((knowledge) => knowledge !== item)
          );
        } else {
          setSelectedKnowledges((prevSelectedKnowledges) => [
            ...prevSelectedKnowledges,
            item,
          ]);
        }
        break;
      case "languages":
        if (selectedLanguages.includes(item)) {
          setSelectedLanguages((prevSelectedLanguages) =>
            prevSelectedLanguages.filter((language) => language !== item)
          );
        } else {
          setSelectedLanguages((prevSelectedLanguages) => [
            ...prevSelectedLanguages,
            item,
          ]);
        }
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setSelectedTools([]);
    setSelectedSoftSkills([]);
    setSelectedKnowledges([]);
    setSelectedLanguages([]);
  };

  console.log(
    selectedTools,
    selectedSoftSkills,
    selectedKnowledges,
    selectedLanguages
  );

  const handleUpdate = async () => {
    const data = {
      tools: selectedTools,
      soft_skills: selectedSoftSkills,
      knowledges: selectedKnowledges,
      languages: selectedLanguages,
    };

    try {
      const response = await UpdateLearnerKnowObject(learner[0].Learner_ID, data);
      if (response.status === 200) {
        console.log("Update successful");
        const updatedLearner = {
          ...learner[0],
          tools: data.tools.map(tool => tool.Tool_Name),
          soft_skills: data.soft_skills.map(softSkill => softSkill.Soft_Skill_Name),
          knowledges: data.knowledges.map(knowledge => knowledge.Knowledge_Name),
          languages: data.languages.map(language => language.Language_Name),
        };
        localStorage.removeItem('learner');
        localStorage.setItem('learner', JSON.stringify([updatedLearner]));
        setLearner([updatedLearner]);
        onClose();
        window.location.reload();
      } else {
        console.error("Update failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="flex justify-between">
        Choose Learning Objects        
        <Button onClick={onClose}>Close</Button>
      </DialogTitle>
      <DialogContent>
        <div>
          <h3 className="font-bold">Tools</h3>
          <ul className="flex flex-wrap mx-10">
            {tools.map((tool, index) => (
              <li
                key={index}
                className={`flex justify-center items-center cursor-pointer mb-2 mr-2 w-20 h-20 rounded-full text-[14px] p-2 text-center whitespace-normal ${
                  selectedTools.includes(tool)
                    ? "bg-orange-300"
                    : "bg-orange-200"
                }`}
                onClick={() => handleItemClick(tool, "tools")}
              >
                <p className="truncate" title={tool.Tool_Name}>
                  {tool.Tool_Name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Soft Skills</h3>
          <ul className="flex flex-wrap mx-10">
            {softSkills.map((softSkill, index) => (
              <li
                key={index}
                className={`flex justify-center items-center cursor-pointer mb-2 mr-2 w-20 h-20 rounded-full text-[14px] p-2 text-center whitespace-normal ${
                  selectedSoftSkills.includes(softSkill)
                    ? "bg-violet-300"
                    : "bg-violet-200"
                }`}
                onClick={() => handleItemClick(softSkill, "soft_skills")}
              >
                <p className="truncate" title={softSkill.Soft_Skill_Name}>
                  {softSkill.Soft_Skill_Name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Knowledges</h3>
          <ul className="flex flex-wrap mx-10">
            {knowledges.map((knowledge, index) => (
              <li
                key={index}
                className={`flex justify-center items-center cursor-pointer mb-2 mr-2 w-20 h-20 rounded-full text-[14px] p-2 text-center whitespace-normal ${
                  selectedKnowledges.includes(knowledge)
                    ? "bg-blue-300"
                    : "bg-blue-200"
                }`}
                onClick={() => handleItemClick(knowledge, "knowledges")}
              >
                <p className="truncate" title={knowledge.Knowledge_Name}>
                  {knowledge.Knowledge_Name}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Languages</h3>
          <ul className="flex flex-wrap mx-10">
            {languages.map((language, index) => (
              <li
                key={index}
                className={`flex justify-center items-center cursor-pointer mb-2 mr-2 w-20 h-20 rounded-full text-[14px] p-2 text-center whitespace-normal ${
                  selectedLanguages.includes(language)
                    ? "bg-pink-300"
                    : "bg-pink-200"
                }`}
                onClick={() => handleItemClick(language, "languages")}
              >
                <p className="truncate" title={language.Language_Name}>
                  {language.Language_Name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate}>Update</Button>
        <Button onClick={handleClear}>Clear</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LearnObjectPopup;
