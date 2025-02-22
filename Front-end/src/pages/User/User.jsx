import React, { useState, useEffect } from "react";
import { useContext } from "react";
import user_img from "../../assets/man.png";
import { FaRegEdit } from "react-icons/fa";
import { IoIosSave, IoIosCloseCircle } from "react-icons/io";

import { LearnerContext } from "../../components/Context/LearnerContext";
import LearnObjectPopup from "../../components/Popup/LearnObjectPopup";

import { GetLearnerKnowObjects, UpdateLearnerInfo } from "../../api/userApi";

import { Button } from "@mui/material";

const User = () => {
  const { learner } = useContext(LearnerContext);
  const [isEdit, setIsEdit] = useState(null);
  const [formValues, setFormValues] = useState({
    Learner_ID: "",
    Name: "",
    Age: "",
    Email: "",
    Password: "",
    Address: "",
    Phone: "",
  });
  const [knowItems, setKnowItems] = useState({
    tools: [],
    soft_skills: [],
    knowledges: [],
    languages: [],
    total: 0,
  });

  useEffect(() => {
    const fetchKnowItems = async () => {
      if (learner) {
        setFormValues({
          Learner_ID: learner[0].Learner_ID,
          Name: learner[0].Name,
          Age: learner[0].Age,
          Email: learner[0].Email,
          Password: learner[0].Password,
          Address: learner[0].Address,
          Phone: learner[0].Phone,
        });

        const response = await GetLearnerKnowObjects(learner[0].Learner_ID);
        if (response.status === 200) {
          setKnowItems({
            tools: response.data.tools,
            soft_skills: response.data.soft_skills,
            knowledges: response.data.knowledges,
            languages: response.data.languages,
            total: response.data.total_known_items,
          });
        }
        if (response.data.total_known_items === 0) {
          setShowPopup(true);
        }
      }
    };
    fetchKnowItems();
  }, [learner]);

  console.log(knowItems.tools);

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleClose = () => {
    setIsEdit(false);
  };

  const handleSave = async () => {
    const { Learner_ID, Name, Age, Email, Address, Phone,  ...data } = formValues;
    const formData = {
      ...data,
      Learner_ID: Learner_ID,
      Name: Name,
      Age: Age,
      Email: Email,
      Address: Address,
      Phone: Phone,
    }
    try {
      const response = await UpdateLearnerInfo(learner.Learner_ID, formData);
      if((response.status === 200)) {
        localStorage.removeItem('learner');
        localStorage.setItem('learner', JSON.stringify([formData]));
        setIsEdit(false);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <div className="flex my-10 mx-10 justify-center">
        <div className="flex flex-col w-full h-72 mr-10 rounded-3xl bg-white lg:w-1/3 items-center justify-center">
          <div className="w-44 h-44">
            <img className="rounded-full" src={user_img} alt="user_image" />
          </div>
          <p className="font-medium text-xl">{formValues.Name}</p>
        </div>

        <div className="flex w-full h-72 rounded-3xl bg-white lg:w-1/2">
          <div className="flex flex-col mt-1 mx-5 justify-start">
            <p className="py-2 font-bold">User ID:</p>
            <p className="py-2 font-bold">Full name:</p>
            <p className="py-2 font-bold">Age:</p>
            <p className="py-2 font-bold">Email:</p>
            <p className="py-2 font-bold">Address:</p>
            <p className="py-2 font-bold">Phone number:</p>
            <p className="py-2 font-bold">Known learning objects:</p>
          </div>

          {isEdit ? (
            <>
              <div className="flex flex-col mr-2 w-[330px]">
                <p className="py-2 mt-1">
                  {formValues.Learner_ID ? formValues.Learner_ID : "-"}
                </p>
                <input
                  type="text"
                  name="Name"
                  value={formValues.Name}
                  onChange={handleChange}
                  className="my-1 py-1 border border-2"
                />
                <input
                  type="text"
                  name="Age"
                  value={formValues.Age}
                  onChange={handleChange}
                  className="my-1 py-1 border border-2"
                />
                <input
                  type="text"
                  name="Email"
                  value={formValues.Email}
                  onChange={handleChange}
                  className="my-1 py-1 border border-2"
                />
                <input
                  type="text"
                  name="Address"
                  value={formValues.Address}
                  onChange={handleChange}
                  className="my-1 py-1 border border-2"
                />
                <input
                  type="text"
                  name="Phone"
                  value={formValues.Phone}
                  onChange={handleChange}
                  className="my-1 py-1 border border-2"
                />
                <p>{knowItems.total ? knowItems.total : 0}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center mr-2 w-[330px]">
                <p className="py-2">
                  {formValues.Learner_ID ? formValues.Learner_ID : "-"}
                </p>
                <p className="py-2">
                  {formValues.Name ? formValues.Name : "-"}
                </p>
                <p className="py-2">{formValues.Age ? formValues.Age : "-"}</p>
                <p className="py-2">
                  {formValues.Email ? formValues.Email : "-"}
                </p>
                <p className="py-2">
                  {formValues.Address ? formValues.Address : "-"}
                </p>
                <p className="py-2">
                  {formValues.Phone ? formValues.Phone : "-"}
                </p>
                <p className="py-2">{knowItems.total ? knowItems.total : 0}</p>
              </div>
            </>
          )}
          <div className="flex flex-col my-2">
            {isEdit ? (
              <>
                <button
                  id="btn-close"
                  className="text-[27px] cursor-pointer hover:text-red-700 transition duration-500 mb-2"
                  onClick={handleClose}
                >
                  <IoIosCloseCircle />
                </button>
                <button
                  id="btn-save"
                  className="text-[27px] cursor-pointer hover:text-green-700 transition duration-500"
                  onClick={handleSave}
                >
                  <IoIosSave />
                </button>
              </>
            ) : (
              <>
                <button
                  id="btn-edit"
                  className="text-[25px] cursor-pointer hover:text-violet-700 transition duration-500"
                  onClick={handleEdit}
                >
                  <FaRegEdit />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col mx-32 bg-white rounded-3xl p-5">
        <div className="mx-5">
          <p className="font-bold text-2xl">Known Learning Objects</p>
        </div>
        <div>
          {knowItems.tools ? (
            <>
              <p className="my-2 font-bold">Tools</p>
              <div className="flex mx-10">
                {knowItems.tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-2 w-20 h-20 rounded-full bg-orange-200 text-[14px] p-2 text-center whitespace-normal"
                  >
                    <p className="truncate">{tool}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {knowItems.soft_skills ? (
            <>
              <p className="my-2 font-bold">Soft Skills</p>
              <div className="flex mx-10">
                {knowItems.soft_skills.map((soft_skill, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-2 w-20 h-20 rounded-full bg-violet-200 text-[14px] p-2 text-center whitespace-normal"
                  >
                    <p className="truncate">{soft_skill}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {knowItems.knowledges ? (
            <>
              <p className="my-2 font-bold">Knowledges</p>
              <div className="flex mx-10">
                {knowItems.knowledges.map((knowledge, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-2 w-20 h-20 rounded-full bg-blue-200 text-[14px] p-2 text-center whitespace-normal"
                  >
                    <p className="truncate">{knowledge}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div>
          {knowItems.languages ? (
            <>
              <p className="my-2 font-bold">Languages</p>
              <div className="flex mx-10">
                {knowItems.languages.map((language, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-2 w-20 h-20 rounded-full bg-pink-200 text-[14px] p-2 text-center whitespace-normal"
                  >
                    <p className="truncate">{language}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <Button onClick={() => setShowPopup(true)}>Update</Button>
      <LearnObjectPopup open={showPopup} onClose={handleClosePopup} knowItemsTools={knowItems.tools} knowItemsSoftSkills={knowItems.soft_skills} knowItemsKnowledges={knowItems.knowledges} knowItemsLanguages={knowItems.languages} />
      </div>
    </div>
  );
};

export default User;
