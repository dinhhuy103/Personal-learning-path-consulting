import axios from "axios";

const API_URL = 'http://localhost:5001';

export const getAllCareer = () => {
    return axios.get(`${API_URL}/career`);
};

export const getAllTool = () => {
    return axios.get(`${API_URL}/tool`);
};

export const getAllSoftSkill = () => {
    return axios.get(`${API_URL}/soft_skill`);
};

export const getAllKnowledge = () => {
    return axios.get(`${API_URL}/knowledge`);
};

export const getAllLanguage = () => {
    return axios.get(`${API_URL}/language`);
};

export const getAllCourse = () => {
    return axios.get(`${API_URL}/course`);
};

export const getCourseById = (skillId, skillType) => {
    return axios.get(`${API_URL}/get_course_by_id/${skillId}?skillType=${skillType}`, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export const getPrerequisiteSkill = (course_id) => {
    return axios.get(`${API_URL}/get_prerequisite_skill/${course_id}`);
};

export const getTeachSkill = (course_id) => {
    return axios.get(`${API_URL}/get_teach_skill/${course_id}`);
};

export const getNeedSkill = (career_id) => {
    return axios.get(`${API_URL}/get_need_skill/${career_id}`);
};

export const getLearningPath = (career_id) => {
    return axios.get(`${API_URL}/get_learning_path/${career_id}`);
};