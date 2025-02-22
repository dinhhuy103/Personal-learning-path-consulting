import React, { createContext, useEffect, useState } from "react";

export const LearnerContext = createContext();

const LearnerContextProvider = ({children}) => {
    const [learner, setLearner] = useState(null);

    useEffect(() => {
        const storeLearner = localStorage.getItem('learner');
        setLearner(JSON.parse(storeLearner));
    }, []);

    useEffect(() => {
        localStorage.setItem('learner', JSON.stringify(learner));
    }, [learner]);

    return (
        <LearnerContext.Provider
            value={{
                learner,
                setLearner,
               }}
        >
            {children}
        </LearnerContext.Provider>
    );
};

export default LearnerContextProvider;