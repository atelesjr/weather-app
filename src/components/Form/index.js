import React from 'react';

import './form.css';

const Form = props => {

    // const alert = () =>( 
    //     <div className="alert alert-danger mx-5" role="alert">
    //         Please enter City and Country
    //     </div>
    // );

    const {
        getWeather,
        handleChange,
        city,
        country,
        btnName,
        changeIcon
    } = props;
    
    return (
        <div className="containers">
            <form>
                <div className="rows">
                    <div className="input_group">
                        <input 
                            type="text" 
                            className="form-control"
                            name="city"
                            autoComplete="off"
                            placeholder="City"
                            onChange={handleChange}
                            value={city}
                        />
                    </div>
                    <div className="input_group">
                        <input 
                            type="text" 
                            className="form-control"
                            name="country"
                            autoComplete="off"
                            placeholder="Country"
                            onChange={handleChange}
                            value={country}
                        />
                    </div>
                    
                        <button 
                            type="button"
                            className="btn btn-warning"
                            onClick={ getWeather }
                        >
                            {
                                changeIcon
                                ?  <i className="fas fa-search"/> 
                                :  <i className="fas fa-map-marker-alt"/> 
                            }
                            { btnName }
                        </button>
                    
                </div>
            </form>
        </div>
    );
};


export default Form;