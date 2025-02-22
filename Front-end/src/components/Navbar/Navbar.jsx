import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { LearnerContext } from '../Context/LearnerContext';


const Navbar = () => {
    const { setLearner } = useContext(LearnerContext);
    const [active, setActive] = useState('/');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('learner');
        setLearner(null);
        console.log('Logging out...');
        navigate('/');
    };

    return (
        <header className='bg-white'>
            <nav className='mx-auto flex max-w-8xl items-center justify-between p-6 lg:px-8'>
                <div className='flex lg:flex-1'>
                    <a href="/user" className="-m-1.5 p-1.5 flex items-center">
                        <span className="ml-2 font-bold"><span className='font-normal'></span></span>
                    </a>
                </div>

                <div className='hidden lg:flex lg:gap-x-12'>
                    <NavLink to="/user" onClick={() => setActive('/user')} className={`hover:text-violet-500 text-sm font-semibold leading-6 ${active === '/user' ? 'text-violet-500' : 'text-gray-900'}`}>
                        User
                    </NavLink>
                    <NavLink to="/career" onClick={() => setActive('/career')} className={`hover:text-violet-500 text-sm font-semibold leading-6 ${active === '/career' ? 'text-violet-500' : 'text-gray-900'}`}>
                        Career
                    </NavLink>
                    <NavLink to="/course" onClick={() => setActive('/course')} className={`hover:text-violet-500 text-sm font-semibold leading-6 ${active === '/course' ? 'text-violet-500' : 'text-gray-900'}`}>
                        Course
                    </NavLink>
                    <NavLink to="/learning-object" onClick={() => setActive('/learning-object')} className={`hover:text-violet-500 text-sm font-semibold leading-6 ${active === '/learning-object' ? 'text-violet-500' : 'text-gray-900'}`}>
                        Learning Object
                    </NavLink>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <button onClick={handleLogout} className="text-sm font-semibold leading-6 text-gray-900">
                        Log out<span aria-hidden="true"> </span>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
