import React, { useEffect, useRef, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import DispatchContext from "../../DispatchContext";
import InnerDispatchContext from "../InnerDispatchContext";

function Item(props) {
    const appDispatch = useContext(DispatchContext); 
    const homeDispatch = useContext(InnerDispatchContext);
    const checkBtnRef = useRef();
    const deleteBtnRef = useRef();
    const hiddenSpan = useRef();
    const inputField = useRef();
    const todoItem = useRef();
    let isManualClick = false;

    const originalState = {
        item: {
            value: props.item.description,
            completed: props.item.completed,
            id: props.item.id,
            hasErrors: false,
            errorMessages: [],
            width: '',
            widthChangeCounter: 0,
            focus: false
        },
        descriptionChanged: false,
        descriptionUpdateCounter: 0,
        completedCounter: 0,
        deleteCounter: 0
    }

    function itemReducer(draft, action) {
        switch(action.type) {
            case 'descriptionChanged':
                draft.item.hasErrors = false;
                draft.item.value = action.value;
                draft.descriptionChanged = true;
                return;
            case 'descriptionUpdate':
                if(!action.value.trim()) {
                    draft.item.hasErrors = true;
                    draft.item.errorMessages.push('You must provide an item content!');
                }
                if(action.value.length > 50) {
                    draft.item.hasErrors = true;
                    draft.item.errorMessages.push('Item description cannot exceed 50 characters!');
                }
                if(!draft.item.errorMessages.length && draft.descriptionChanged) {
                    draft.descriptionUpdateCounter++;
                    draft.descriptionChanged = false;
                }
                return;
            case 'itemStatus':
                draft.completedCounter++;

                if(action.value) {
                    draft.item.completed = 0;
                } else {
                    draft.item.completed = 1;
                }
                return;
            case 'itemDeleteStatus':
                draft.deleteCounter++;
                return;
            case 'saveItemWidth':
                draft.item.width = action.value;
                return;
            case 'itemWidthChanged':
                draft.item.widthChangeCounter++;
                return;
            case 'itemOnFocus':
                draft.item.focus = true;
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(itemReducer, originalState);


    useEffect(() => {
        if(state.descriptionUpdateCounter) {
            const ourRequest = Axios.CancelToken.source();

            async function updateItem() {
                try {
                    const response = await Axios.post(`/update-item`, {
                        item_description: state.item.value,
                        completed: state.item.completed,
                        id: state.item.id
                    }, { cancelToken: ourRequest.token });
                    
                    if(response.data === 'success') {
                        appDispatch({ type: 'flashMessage', value: `Item was successfully updated!`, class: 'success' });
                    } else {
                        appDispatch({ type: 'flashMessage', value: `Sorry, we couldn't update selected item!`, class: 'danger' });
                    }
                } catch(e) {
                    console.log('Sorry, there was a problem!');
                }
            }

            updateItem();

            return () => {
                ourRequest.cancel();
            }
        }
    }, [state.descriptionUpdateCounter]);

    useEffect(() => {
        if(state.completedCounter) {
            const ourRequest = Axios.CancelToken.source();

            async function updateItemStatus() {
                try {
                    const response = await Axios.post(`/update-item-status`, {
                        id: state.item.id,
                        completed: state.item.completed
                    }, { cancelToken: ourRequest.token });
                    homeDispatch({ type: 'statusUpdated' });
                } catch(e) {
                    console.log('Sorry, there was a problem!');
                }
            }

            updateItemStatus();

            return () => {
                ourRequest.cancel();
            }
        }
    }, [state.completedCounter]);

    useEffect(() => {
        if(state.deleteCounter) {
            const ourRequest = Axios.CancelToken.source();

            async function deleteItem() {
                const confirmPrompt = confirm('Are you sure you want to delete this todo item?');
                if(confirmPrompt) {
                    try {
                        const response = await Axios.post(`/delete-item`, {
                            id: state.item.id
                        }, { cancelToken: ourRequest.token });
                        
                        if(response.data) {
                            homeDispatch({ type: 'itemDeleted', value: state.deleteCounter });
                            appDispatch({ type: 'flashMessage', value: response.data, class: 'success' });
                        } else {
                            appDispatch({ type: 'flashMessage', value: 'Sorry, we did not get to delete this item!', class: 'danger' });
                        }
                    } catch(e) {
                        console.log('Sorry, there was a problem!');
                    }
                }
            }

            deleteItem();

            return () => {
                ourRequest.cancel();
            }
        }
    }, [state.deleteCounter]);

    useEffect(() => {
        dispatch({ type: 'saveItemWidth', value: hiddenSpan.current.offsetWidth })
    }, [state.item.widthChangeCounter]);

    

    function checkHandler(e) {
        if (isManualClick) {
            isManualClick = false;
            return;
        }

        if (e.target !== checkBtnRef.current) {
            e.stopPropagation();
            isManualClick = true;
            checkBtnRef.current.click();
        }

        dispatch({ type: 'itemStatus', value: state.item.completed });
    }

    function handleDeleteItem(e) {
        if (isManualClick) {
            isManualClick = false;
            return;
        }

        if (e.target !== deleteBtnRef.current) {
            e.stopPropagation();
            isManualClick = true;
            deleteBtnRef.current.click();
        }

        dispatch({ type: 'itemDeleteStatus' });
    }

    function handleFieldInput(e) {
        hiddenSpan.current.textContent = e.target.value;
        e.target.style.width = `${ hiddenSpan.current.offsetWidth + 10 }px`;
        dispatch({ type: 'itemWidthChanged' });
    }

    function handleClickItem(e) {
        if (isManualClick) {
            isManualClick = false;
            return;
        }

        if (e.target === todoItem.current) {
            e.stopPropagation();
            isManualClick = true;
            inputField.current.focus();
        }
    }

    function prityCompleted() {
        let completedText = '';

        if(state.item.completed) {
            completedText = 'completed';
        }

        return completedText;
    }


    return (
        <li 
            data-id={ state.item.id } 
            className={ `todo-item ${ prityCompleted() } ${ state.item.hasErrors ? 'has-error' : '' }` } 
            ref={ todoItem }
            data-completed={ state.item.completed }
            onClick={ handleClickItem }
            style={{ '--input-width': state.item.width + 10 +'px' }}
        >
            <input
                type="text" 
                name="item_description" 
                id={`${'todo-item-item_description-' + state.item.id}`}
                className="todo-item__text-input" 
                ref={ inputField }
                autoComplete="off"
                value={ state.item.value } 
                onChange={ (e) => dispatch({ type: 'descriptionChanged', value: e.target.value }) }
                onBlur={ (e) => dispatch({ type: 'descriptionUpdate', value: e.target.value }) }
                onInput={ handleFieldInput }
            />
            <span className="hidden-input-content" ref={ hiddenSpan }>{ state.item.value }</span>

            <div className="check-btn__wrapper" onClick={ checkHandler } ref={ checkBtnRef } >
                <button className={ `check-btn ${ prityCompleted() }` }>
                    <img className="check-btn__icon" src={ `${ process.env.REACT_APP_FILE_PATH_DIST }assets/images/icon-check.svg` } alt="Check Icon" />
                </button>
            </div>

            <div className="todo-item-cta">
                <button className="action-button delete-me" onClick={ handleDeleteItem } ref={ deleteBtnRef }>
                    <span className="hidden">Delete</span>
                    <img className="action-button__icon" src={ `${ process.env.REACT_APP_FILE_PATH_DIST }assets/images/icon-cross.svg` } alt="Delete Icon" />
                </button>
            </div>

            { state.item.hasErrors &&  
                <div className={ `field-messages ${state.item.hasErrors && 'active'}` }>
                    { 
                        state.item.errorMessages.map((errMessage, index) => {
                            return (
                                <div className="field-error-message" key={ `${errMessage}-${index}` }>
                                    <p className="field-error-message__description">{ errMessage }</p>
                                </div>
                            )
                        }) 
                    }
                </div>
            }
        </li>

    );
}

export default Item;