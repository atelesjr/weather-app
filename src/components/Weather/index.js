import React from 'react';

const Weather = (props) => {
    const {
        local,  
        icon,
        celsius,
        tempMin,
        tempMax,
        description
    } = props;
    return(
        <div className="container">
            <div className="cards pt-4">
                <h1>{ local }</h1>
                <h5 className="py-4">
                    <i className={`wi ${ icon } display-1`} />
                </h5>
                {
                    celsius
                    ? <h1 className="py-2">{celsius}&deg;</h1>
                    : null
                }
                
                { minmaxTemp(tempMin, tempMax) }

                <h4 className="py-3">{description}</h4>
            </div>
        </div>
    );
};

function minmaxTemp(min, max) {

    if(min && max){
    return (
        <h3>
            <span className="px-4">{min}&deg;</span>
            <span className="px-4">{max}&deg;</span>
        </h3>
    )} else {
        return null
    }
}

export default Weather;