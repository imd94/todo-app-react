import React, { useEffect } from "react";

function Container(props) {
    return (
        <div className="app-container">
            { props.children }
        </div>
    );
}

export default Container;