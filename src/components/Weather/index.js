import React from 'react';

import '../../styles/weather.css';

const Weather = props => {
    const {
        local,  
        icon,
        celsius,
        tempMin,
        tempMax,
        address,
        description,
        sunrise,
        sunset,
        hide
    } = props;

    return(
        
        <div className="display">
            <h1>{ local }</h1>
            <h5>
                <i className={`wi ${ icon } display-1`} />
            </h5>
            {
                celsius
                ? <h1>{celsius}&deg; C</h1>
                : null
            }
            { minmaxTemp(tempMin, tempMax) }
            <h4>{description}</h4>
            {   
                !hide && (sunrise && sunset)
                ? <h5>
                    <i className="wi wi-sunrise sunposition" /> { sunrise } 
                    <i className="wi wi-sunset sunposition" /> { sunset }
                    </h5>
                : null
            } 
            <h5>{ !hide  ?  address : null }</h5>
        </div>
       
    );
};

function minmaxTemp(min, max) {
    if(min && max){
    return (
        <h3>
            <span className="px-4">{min}&deg; C</span>
            <span className="px-4">{max}&deg; C</span>
        </h3>
    )} else {
        return null
    }
}

export default Weather;