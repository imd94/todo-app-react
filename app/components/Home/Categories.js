import React, { useEffect, useState, useContext } from "react";

import InnerStateContext from "../InnerStateContext";
import InnerDispatchContext from "../InnerDispatchContext";

function Categories(props) {
    const homeState = useContext(InnerStateContext);
    const homeDispatch = useContext(InnerDispatchContext);

    function handleCategoryTrigger(e) {
        let triggeredCategory = e.target;

        if(triggeredCategory.classList.contains('category--active')) {
            homeDispatch({ type: 'categoryTriggered', value: 'category--active' });
        } else if(triggeredCategory.classList.contains('category--completed')) {
            homeDispatch({ type: 'categoryTriggered', value: 'category--completed' });
        } else {
            homeDispatch({ type: 'categoryTriggered', value: 'category--all' });
        }
    }

    return (
        <div className="item-categories">
            <span 
                onClick={ handleCategoryTrigger }
                className={ `category category--all ${homeState.currentCategory === 'category--all' ? 'current' : '' }` }
            >
                All
            </span>

            <span 
                onClick={ handleCategoryTrigger }
                className={ `category category--active ${homeState.currentCategory === 'category--active' ? 'current' : '' }` }
            >
                Active
            </span>

            <span 
                onClick={ handleCategoryTrigger }
                className={ `category category--completed ${homeState.currentCategory === 'category--completed' ? 'current' : '' }` }
            >
                Completed
            </span>
        </div>
    );
}

export default Categories;