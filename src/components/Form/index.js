import React from 'react';

import '../../styles/form.css';

const Form = props => {

    const {
        getWeather,
        getLocation,
        handleChange,
        city,
        country,
        btnName,
        changeIcon,
        hide
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
                            onClick={ hide?  getWeather : getLocation }
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