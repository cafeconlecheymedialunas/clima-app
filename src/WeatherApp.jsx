import { useEffect, useState } from "react";

export default function WeatherApp() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [clima, setClima] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const countriesData = await fetchCountries();
            setCountries(countriesData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const fetchStatesData = async () => {
                const statesData = await fetchStates(selectedCountry);
                setStates(statesData);
            };

            fetchStatesData();
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedCountry && selectedState) {
            const fetchCitiesData = async () => {
                const citiesData = await fetchCities(selectedCountry, selectedState);
                setCities(citiesData);
            };

            fetchCitiesData();
        }
    }, [selectedCountry, selectedState]);


    useEffect(() => {
        if (selectedCity) {
            const fetchClimaData = async () => {
                const climaData = await fetchClima(selectedCity);
                setClima(climaData)
            };

            fetchClimaData();
        }
    }, [selectedCity]);

    const fetchCountries = async () => {
        try {
            const url = `https://countriesnow.space/api/v0.1/countries/flag/images`;
            const response = await fetch(url);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };



    const fetchStates = async (country) => {
        try {
            const url = "https://countriesnow.space/api/v0.1/countries/states";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country })
            });
            const result = await response.json();
            return result.data.states;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchCities = async (country, state) => {
        try {
            const url = `https://countriesnow.space/api/v0.1/countries/state/cities`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ country, state })
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const fetchClima = async (city) => {

        try {

            const apiKey = "d34b21958b60c231b0efa805b33a8753"
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=es`
            const response = await fetch(url)
            const result = await response.json()
            return result


        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeCountry = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedState(""); // Reiniciar el estado cuando se cambia el país
        setSelectedCity(""); // Reiniciar la ciudad cuando se cambia el país
    };

    const handleChangeState = (e) => {
        setSelectedState(e.target.value);
        setSelectedCity(""); // Reiniciar la ciudad cuando se cambia el estado
    };

    const handleChangeCity = (e) => {
        setSelectedCity(e.target.value);
    };

    return (
        <>
            <div className="container text-center ">
                <div className="container d-flex flex-column algin-items-center flex-center">
                    <h1>Aplicación del clima en</h1>
                    <div className="form row mt-4">
                        <div className="form-group col">
                            <select name="countries" className="form-control" value={selectedCountry} onChange={handleChangeCountry}>
                                <option value="">Elegir un País</option>
                                {countries.map(country => (
                                    <option key={country.iso2} value={country.name}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        {states && states.length > 0 && (
                            <div className="form-group col">
                                <select name="states" className="form-control" id="" value={selectedState} onChange={handleChangeState}>
                                    <option value="">Elegir un estado</option>
                                    {states.map(state => <option key={state.name} value={state.name}>{state.name}</option>)}
                                </select>
                            </div>
                        )}

                        {cities && cities.length > 0 && (
                            <div className="form-group col">
                                <select name="cities" className="form-control" id="" value={selectedCity} onChange={handleChangeCity}>
                                    <option value="">Elegir una ciudad</option>
                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                </div>
                {clima && (

                    <div className="container mt-4">
                        {clima.weather.length > 0 && (

                            clima.weather.map((weather) =>
                                <div key={weather.id} className="card">
                                    <div className="card-header"> <h1>{clima.name}</h1></div>
                                    <div className="card-body">
                                        {weather.icon && (
                                            <img
                                                src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                                                alt="Clima"
                                            />
                                        )}

                                        <h5 className="card-title">{weather.main}</h5>
                                        <p className="card-text">{weather.description}</p>
                                        < p > Temperatura: {parseInt(clima.main.temp - 273.15)} °C</p>
                                    </div>


                                </div>
                            )

                        )}


                    </div>

                )}
            </div >
        </>
    );
}
