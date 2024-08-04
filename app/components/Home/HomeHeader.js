import React, { useEffect, useState, useContext } from "react";
import InnerStateContext from "../InnerStateContext";
import InnerDispatchContext from "../InnerDispatchContext";

function HomeHeader() {
    const homeDispatch = useContext(InnerDispatchContext);
    const homeState = useContext(InnerStateContext);

    function handleThemeSwitch(e) {
        e.preventDefault();
        homeDispatch({ type: 'darkModeActive'});
    }
    

    return (
        <header className="todo-header">
            <h1 className="todo-header__title">Todo</h1>
            <button onClick={ handleThemeSwitch } className={ `light-switch ${ homeState.darkMode ? 'dark-mode' : '' }` }>
                <span className="light-switch__text">Light switch</span>
            </button>
        </header>
    );
}

export default HomeHeader;