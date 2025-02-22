import axios from 'axios'; 

const API_URL = 'http://localhost:5001';

export const UserLogin = (email, password) => {
    return axios.post(`${API_URL}/login`, {email, password});
};

export const UserRegister = (formData) => {
    return axios.post(`${API_URL}/register`, {formData});
};

export const GetLearner = (id) => {
    return axios.get(`${API_URL}/learner/${id}`);
}

export const GetLearnerKnowObjects = (learner_id) => {
    return axios.get(`${API_URL}/learner/${learner_id}/known`);
}

export const UpdateLearnerInfo = (learner_id, formData) => {
    return axios.put(`${API_URL}/learner/${learner_id}/update_info`, {formData});
};


export const UpdateLearnerKnowObject = (learner_id, data) => {
    return axios.put(`${API_URL}/learner/${learner_id}/update_learning_object`, {data});
};