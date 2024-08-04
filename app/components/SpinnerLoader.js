import React, { useEffect } from "react";

function SpinnerLoader(props) {
    return (
        <div className={`loader-spinner__wrapper-box ${ props.addClass != undefined ? props.addClass : '' }`}>
            <div className="loader-spinner"></div>
        </div>
    );
}

export default SpinnerLoader;