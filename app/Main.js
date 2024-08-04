import React, { useEffect, useReducer, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import './assets/styles/styles.scss'

Axios.defaults.baseURL = process.env.BACKENDURL;

// Context
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import FlashMessages from './components/FlashMessages';
import SpinnerLoader from './components/SpinnerLoader';

// Components
const Home = React.lazy(() => import('./components/Home/Home'));

function App(props) {
    const originalState = {
        flashMessages: {
            messages: [],
            class: ''
        }
    }

    function ourReducer(draft, action) {
        switch(action.type) {
            case 'flashMessage':
                draft.flashMessages.messages.push(action.value);
                if(action.class == 'success') {
                    draft.flashMessages.class = 'status-success'
                }
                if(action.class == 'danger') {
                    draft.flashMessages.class = 'status-danger'
                }
                if(action.class == 'warning') {
                    draft.flashMessages.class = 'status-warning'
                }
                if(action.class == 'info') {
                    draft.flashMessages.class = 'status-info'
                }
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>

                <BrowserRouter>

                    <FlashMessages />

                    <Suspense fallback={ <SpinnerLoader /> }>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>  
                    </Suspense>

                </BrowserRouter>

            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);

/* if (module.hot) {
    module.hot.accept()
} */

// https://github.com/LearnWebCode/react-course