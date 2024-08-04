import React, { useEffect } from "react";

function Hero(props) {
    return (
        <div className={ `hero ${props.bgImage ? '' : 'no-bg'}` }>
            <img src={ `${ process.env.REACT_APP_PUBLIC_PATH ? process.env.REACT_APP_PUBLIC_PATH : '/' }assets/images/bg-desktop-${ props.darkMode ? 'dark' : 'light' }.jpg` } alt="Hero Image" />
        </div>
    );
}

export default Hero;