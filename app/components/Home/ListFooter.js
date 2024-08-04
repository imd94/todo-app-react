import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";

import DispatchContext from "../../DispatchContext";
import InnerDispatchContext from "../InnerDispatchContext";

function ListFooter(props) {
    const appDispatch = useContext(DispatchContext);
    const homeDispatch = useContext(InnerDispatchContext);
    const [ clearCounter, setClearCounter ] = useState(0);
    const [ activeItemsNum, setActiveItemsNum ] = useState(0);
    const [ itemsLeftCountLoader, setitemsLeftCountLoader ] = useState(false);
    const [ isSingleCompleted, setIsSingleCompleted ] = useState(false);

    function clearHandler() {
        setClearCounter(clearCounter + 1);
    }

    useEffect(() => {
        const listItems = document.querySelectorAll('.todo-list .todo-item');
        
        if(listItems) {
            const completedItems = Array.from(listItems).filter(item => item.getAttribute('data-completed') === '1');
            
            setIsSingleCompleted(completedItems.length);
        } else {
            return;
        }
    }, [props.itemStatus.statusCompleted]);


    useEffect(() => {
        if(clearCounter) {
            const ourRequest = Axios.CancelToken.source()

            async function clearCompletedItems() {
                if(isSingleCompleted) {
                    try {
                        const areYouSure = window.confirm('Do you really want to delete completed items!');
            
                        if(areYouSure) {
                            const response = await Axios.post(`/delete-completed-items`, { cancelToken: ourRequest.token });
            
                            if(response.data) {
                                homeDispatch({ type: 'deleteCompletedItems', value: clearCounter });
                                appDispatch({ type: 'flashMessage', value: response.data, class: 'success' });
                            } else {
                                appDispatch({ type: 'flashMessage', value: 'Sorry, we did not succeed to delete completed items!', class: 'danger' });
                            }
                        }
                    } catch(e) {
                        console.log('Sorry, there was a problem!');
                    }
                } else {
                    appDispatch({ type: 'flashMessage', value: 'Sorry, there are no completed items to delete!', class: 'danger' });
                }
            }
    
            clearCompletedItems();

            return () => {
                ourRequest.cancel();
            }
        }
    }, [clearCounter]);

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source();
        setitemsLeftCountLoader(true);

        async function getActiveItemsCount() {
            try {
                const response = await Axios.get(`/active-items-count`, { cancelToken: ourRequest.token });
                setActiveItemsNum(response.data);
                setitemsLeftCountLoader(false);
            } catch(e) {
                setitemsLeftCountLoader(false);
                console.log('Sorry, there was a problem!');
            }
        }

        getActiveItemsCount();

        return () => {
            ourRequest.cancel();
        }
    }, [
        props.itemStatus.newItemCreationCounter, 
        props.itemStatus.deleteItemCounter, 
        props.itemStatus.itemsCompletedStatus, 
        props.itemStatus.statusCompleted
    ]);


    return (
        <div className="list-footer">
            <span className="items-count list-footer__items-left">{ !itemsLeftCountLoader ? `${activeItemsNum} items left` : 'Calculating...' }</span>
            <span className="clear-completed-btn list-footer__clear-btn" onClick={ clearHandler }>Clear Completed</span>
        </div>
    );
}

export default ListFooter;