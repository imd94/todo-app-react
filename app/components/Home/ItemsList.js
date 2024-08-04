import React, { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import Item from "./Item";
import ListFooter from "./ListFooter";
import SpinnerLoader from "../SpinnerLoader";

function ItemsList(props) {
    const originalState = {
        items: [],
        isFetching: true,
        isLoading: false,
        notFound: false
    }

    function itemReducer(draft, action) {
        switch(action.type) {
            case 'fetchingStart':
                draft.notFound = false;
                draft.isLoading = true;
                return;
            case 'fetchingComplete':
                draft.notFound = false;
                draft.isFetching = false;
                draft.isLoading = false;
                draft.items = action.value;
                document.querySelector('#create-field').focus();
                return;
            case 'notFound':
                draft.isFetching = false;
                draft.notFound = true;
                document.querySelector('#create-field').focus();
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(itemReducer, originalState);


    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();
        dispatch({ type: 'fetchingStart' });

        async function fetchItems() {
            try {
                const response = await Axios.post(`/items`, {
                    category: props.category
                }, { cancelToken: ourRequest.token });

                if(response.data) {
                    dispatch({ type: 'fetchingComplete', value: response.data });
                } else {
                    dispatch({ type: 'notFound' });
                }
            } catch(e) {
                console.log('Sorry, there was a problem!', e);
            }
        }

        fetchItems();

        return () => {
            ourRequest.cancel();
        }
    }, [
        props.newItemCreationCounter, 
        props.deleteItemCounter, 
        props.categoryTriggerCount, 
        props.itemsCompletedStatus, 
        //props.statusCompleted
    ]);
    

    if(state.isFetching) {
        return (
            <SpinnerLoader /> 
        )
    }

    if(state.notFound) {
        return (
            <div className="not-found">
                <p className="not-found__text">
                    { props.category === 'category--all' && 'Currently there are no created items!' }
                    { (props.category === 'category--active' || props.category === 'category--completed') && `Currently there are no ${ props.category.toLowerCase().replace('category--', '') } items!` }
                </p>
            </div>
        )
    }

    return (    
        <div className={ `item-list-wrapper__inner ${state.isLoading || state.isFetching ? 'loading-state' : ''}` }>
            { state.isLoading && <SpinnerLoader /> }

            { !state.isLoading &&
                <ul id="item-list" className="todo-list">      

                    { state.items.map((item) => {
                        return (
                            <Item item={ item } key={ item.id } />  
                        )
                    }) }

                </ul>
            }

            <ListFooter 
                incomplete={ state.incompletedItemsCount } 
                itemStatus={ {
                    newItemCreationCounter: props.newItemCreationCounter, 
                    deleteItemCounter: props.deleteItemCounter, 
                    itemsCompletedStatus: props.itemsCompletedStatus, 
                    statusCompleted: props.statusCompleted
                } } 
            />
        </div>
    );
}

export default ItemsList;