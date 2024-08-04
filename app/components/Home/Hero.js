import React, { useEffect } from "react";

function Hero(props) {
    return (
        <div className={ `hero ${props.bgImage ? '' : 'no-bg'}` }>
            <img src={ `/assets/images/bg-desktop-${ props.darkMode ? 'dark' : 'light' }.jpg` } alt="Hero Image" />
        </div>
    );
}

export default Hero;