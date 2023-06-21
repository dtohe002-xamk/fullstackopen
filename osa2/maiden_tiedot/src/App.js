import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryNameField = (props) => {
  return (
    <>
      <input 
        value={props.newFilter}  
        onChange={props.handleFilterChange}
      />
    </>
  )
}

const LangRow = ({ value }) =>
  <li>{value}</li>

const LanguageList = ({ languageObject }) => {
  return (
    <div>
      <b>languages:</b>
      <ul>
        {Object.values(languageObject).map((value) => {
          return (
            <LangRow key={value} value={value} />
          )
        })}
      </ul>
    </div>
  )
}

const Flag = ({ flag }) => {
  return (
    <>
      <img src={flag.png} alt='Flag of the country' />
    </>
  )
}

const WeatherDisplay = ({ country, weatherObj}) => {
  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {weatherObj.main.temp - 273.15} Celsius</div>
      <img src={`http://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@2x.png`} alt='Weather icon' />
      <div>wind {weatherObj.wind.speed} m/s</div>
    </div>
  )
}

const CountryDetailView = ({ country, weatherObj }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        capital {country.capital} <br />
        area {country.area}
      </p>
      <LanguageList languageObject={country.languages} />
      <Flag flag={country.flags} />
      <WeatherDisplay country={country} weatherObj={weatherObj} />
    </div>
  )
}

const CountryShowButton = (props) => {
  return (
    <button onClick={() => props.setNameFilter(props.name)}>
      Show
    </button>
  )
}

const CountryListRow = (props) => {
  return (
    <div>
      {props.country.name.common}
      <CountryShowButton 
        name={props.country.name.common}
        setNameFilter={props.setNameFilter} 
      />
    </div>
  )
}

const CountryListRender = (props) => {
  if (props.filteredCountries.length > 10 ) {
    return <div>Too many matches, specify another filter</div>
  }

  // Testing whether the weatherObj has content or not is essential lest it starts rendering before it has been received 
  // from the server which would lead into numerous issues

  if (props.filteredCountries.length === 1 && Object.keys(props.weatherObj).length > 0) {
    return (
      <div>
        <CountryDetailView 
          country={props.filteredCountries[0]}
          weatherObj={props.weatherObj}
        />
      </div>
    )
  }

  return (
    <div>
      {props.filteredCountries.map(country => 
        <CountryListRow 
          key={country.name.common} 
          country={country}
          setNameFilter={props.setNameFilter} 
        />
      )}
    </div>
  )
}

const App = () => {
  const api_key = process.env.REACT_APP_API_KEY

  const [countries, setCountries] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [weatherObj, setWeatherObj] = useState({})
  const [weatherCity, setWeatherCity] = useState(['', ''])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all').then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (weatherCity[0] !== '') {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${weatherCity[0]},${weatherCity[1]}&APPID=${api_key}`).then(response => {    
        setWeatherObj(response.data)
      })
    }
  }, [weatherCity])

  const handleFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  // Having the filter as part of CountryListRender functionality caused an error on initial start-up
  const countriesToShow = () => {
    const filteredCountries = countries.filter(country => 
      country.name.common.toLowerCase().includes(nameFilter.toLowerCase())
    )

    if (filteredCountries.length === 1 ) {
      if (filteredCountries[0].capital !== weatherCity[0] && filteredCountries[0].cc2 !== weatherCity[1]) {
        setWeatherCity([filteredCountries[0].capital, filteredCountries[0].cca2])
      }
    }

    return filteredCountries
  }

  return (
    <div>
      find countries
      <CountryNameField
        nameFilter={nameFilter} 
        handleFilterChange={handleFilterChange} 
      />
      <CountryListRender
        countries={countries}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        weatherObj={weatherObj}
        weatherCity={weatherCity}
        filteredCountries={countriesToShow()}
      />
    </div>
  )
}

export default App;
