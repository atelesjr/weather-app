import React from 'react';

import './form.css';

const Form = props => {

    const alert = () =>( 
        <div className="alert alert-danger mx-5" role="alert">
            Please enter City and Country
        </div>
    );

    const {
        getWeather,
        error,
        handleChange,
        city,
        country,
        btnName
    } = props;
    console.log('Form', btnName )
    return (
        <div className="container">
            <div>{ error ? alert() : null }</div>
            <form>
                <div className="row">
                    <div className="col-md-3 offset-md-2">
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
                    <div className="col-md-3">
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
                    <div className="col-md-3 mt-md-0  py-2 text-md-left ">
                        <button 
                            type="button"
                            className="btn btn-warning"
                            onClick={ getWeather }
                        >
                            { btnName }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default Form;