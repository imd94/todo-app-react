import React, { useEffect, useRef, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import DispatchContext from "../../DispatchContext";
import InnerDispatchContext from "../InnerDispatchContext";

function CreateItem() {
    const appDispatch = useContext(DispatchContext);
    const homeDispatch = useContext(InnerDispatchContext);
    const inputRef = useRef();

    const originalState = {
       description: {
            value: '',
            completed: 0,
            hasErrors: false,
            errMessage: ''
       },
       isSaving: false,
       sendCount: 0
    }

    function compReducer(draft, action) {
        switch(action.type) {
            case 'descriptionChange':
                draft.description.hasErrors = false;
                draft.description.value = action.value;
                return;
            case 'descriptionRules':
                if(!action.value.trim()) {
                    draft.description.hasErrors = true;
                    draft.description.errMessage = 'You must provide an item content!';
                }
                if(action.value.length > 50) {
                    draft.description.hasErrors = true;
                    draft.description.errMessage = 'Item description cannot exceed 50 characters!';
                }
                return;
            case 'saveRequestStarted':
                draft.isSaving = true;
                return;
            case 'saveRequestFinished':
                draft.isSaving = false;
                draft.description.value = '';
                inputRef.current.focus();
                return;
            case 'submitRequest':
                if(!draft.description.hasErrors) {
                    draft.sendCount++;
                }
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(compReducer, originalState);

    useEffect(() => {
        if(state.sendCount) {
            dispatch({ type: 'saveRequestStarted' });
            const ourRequest = Axios.CancelToken.source();

            async function createItem() {
                try {
                    const response = await Axios.post(`/create-item`, {
                        item_description: state.description.value,
                        completed: state.description.completed
                    }, { cancelToken: ourRequest.token });

                    dispatch({ type: 'saveRequestFinished' });

                    if(response.data) {
                        homeDispatch({ type: 'newItemCreated', value: state.sendCount });
                        appDispatch({ type: 'flashMessage', value: `New item was successfuly added!`, class: 'success' });
                    } else {
                        appDispatch({ type: 'flashMessage', value: 'Sorry, we did not get to add new item!', class: 'danger' });
                    }
                    
                } catch(e) {
                    console.log('Sorry, there was a problem!');
                }
            }

            createItem();

            return () => {
                ourRequest.cancel();
            }
        }
    }, [state.sendCount]);

    function submitHandler(e) {
        e.preventDefault();
        dispatch({ type: 'descriptionRules', value: state.description.value });
        dispatch({ type: 'submitRequest' });
    }

    return (
        <form onSubmit={ submitHandler } className="todo-create-item" id="create-form">
            <div className={ `flash-error ${state.description.hasErrors && 'active'}` }>
                { state.description.hasErrors &&  
                    <p className="flash-error__message">{ state.description.errMessage }</p>
                }
            </div>
            
            <div className="todo-item todo-item--create">
                <input 
                    onChange={ (e) => dispatch({ type: 'descriptionChange', value: e.target.value }) }
                    value={ state.description.value } 
                    ref={ inputRef } 
                    id="create-field" 
                    name="item_description" 
                    autoFocus 
                    autoComplete="off" 
                    className="create-field" 
                    type="text" 
                    placeholder="Create a new todo..." 
                />

                <button className="check-btn__wrapper">
                    <span className="check-btn">
                        <span className="hidden">Add New Item</span>
                    </span>
                </button>
            </div>
        </form>
    );
}

export default CreateItem;