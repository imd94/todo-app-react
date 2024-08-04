import React, { useEffect, useContext, useState, act } from "react";
import { useImmerReducer } from 'use-immer';

import InnerDispatchContext from "../InnerDispatchContext";
import InnerStateContext from "../InnerStateContext";

import Page from "../Page";
import Hero from "./Hero";
import HomeHeader from "./HomeHeader";
import CreateItem from "./CreateItem";
import ItemsList from "./ItemsList";
import Attribution from "./Attribution";
import Note from "./Note";
import Categories from "./Categories";

function Home() {
    const originalState = {
        newItemCreationCounter: 0,
        deleteItemCounter: 0,
        itemsCompletedStatus: 0,
        statusCompleted: 0,
        darkMode: Boolean(localStorage.getItem('theme-mode')),
        currentCategory: 'category--all',
        categoryTriggerCount: 0
    }

    function compReducer(draft, action) {
        switch(action.type) {
            case 'newItemCreated':
                draft.newItemCreationCounter = action.value;
                return;
            case 'itemDeleted':
                draft.deleteItemCounter = action.value;
                return;
            case 'deleteCompletedItems':
                draft.itemsCompletedStatus = action.value;
                return;
            case 'statusUpdated':
                draft.statusCompleted++;
                return;
            case 'categoryTriggered':
                draft.currentCategory = action.value;
                draft.categoryTriggerCount++;
                return;
            case 'darkModeActive':
                if(!draft.darkMode) {
                    draft.darkMode = true;
                } else {
                    draft.darkMode = false;
                }
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(compReducer, originalState);
    /* const [category, setCategory] = useState({
        cat: 'category--all'
    }); */


    useEffect(() => {
        if(state.darkMode) {
             localStorage.setItem('theme-mode', 'dark-mode');
        } else {
             localStorage.removeItem('theme-mode');
        } 
    }, [state.darkMode]);


    return (
        <InnerStateContext.Provider value={state}>
            <InnerDispatchContext.Provider value={dispatch}>

                <Hero darkMode={ state.darkMode } bgImage={ true } />
                <Page title="Home">

                    <HomeHeader />
                    <CreateItem />

                    <div className="item-list-wrapper">
                        <ItemsList 
                            newItemCreationCounter={ state.newItemCreationCounter } 
                            deleteItemCounter={ state.deleteItemCounter }
                            itemsCompletedStatus={ state.itemsCompletedStatus }
                            statusCompleted={ state.statusCompleted }
                            category={ state.currentCategory }
                            categoryTriggerCount={ state.categoryTriggerCount }
                            //category={ category.cat }
                        />
                        <Categories />
                        {/* <Categories category={ category } setCategory={ setCategory } /> */}
                    </div>

                    <Note />
                    
                </Page>
                <Attribution />

            </InnerDispatchContext.Provider>
        </InnerStateContext.Provider>
    )
}

export default Home;