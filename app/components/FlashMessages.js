import React, { useEffect, useContext } from "react";

import StateContext from "../StateContext";

function FlashMessages() {
    const appState = useContext(StateContext);

    function properFlashIcon() {
        switch(appState.flashMessages.class) {
            case 'status-success':
                return { path: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z', color: '#17C653' };
            case 'status-danger':
                return { path: 'M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z', color: '#F8285A' };
            case 'status-warning':
                return { path: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z', color: '#F6C000' };
            case 'status-info':
                return { path: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z', color: '#1B84FF' };
            default:
                return { color: '#333333' }
        }
    }

    return (
        <div className={ `flash-messages` }>
            { appState.flashMessages.messages.map((message, index) => {
                return (
                    <div key={index} className={ `flash-messages__message ${appState.flashMessages.class}` }>
                        <svg className="flash-messages__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">{/* !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
                            <path fill={properFlashIcon().color} d={ properFlashIcon().path } />
                        </svg>
                        { message }
                    </div>
                )
            }) }
        </div>
    );
}

export default FlashMessages;