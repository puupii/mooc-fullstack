import { useEffect, useState } from 'react'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [newFilter, setNewFilter] = useState('')
  const [showCountries, setShowCountries] = useState(countries)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    console.log('effect')
    countryService 
      .getAll()
      .then(response=> {
        console.log(response)
        setCountries(response)
        setShowCountries(response)
      })
  }, []);

  if (countries === null) {
    return (
      null
    )}
 

  const handleFilterChange = (event) => {
    console.log('filter', event.target.value);
    setNewFilter(event.target.value);
    countriesToShow(event.target.value);
  }


  const countriesToShow = (newFilter) => {
    setShowCountries(countries.filter(function (Country){
      return (
        Country.name.common.toUpperCase().includes(newFilter.toUpperCase()));
      }))
    console.log(showCountries);
  }

  const showCountryButton = (name) => {
    setNewFilter(name);
    countriesToShow(name);
  }
  

  return (
    <div>
    <Notification message={errorMessage}/>
    <Filter 
    newfilter={newFilter} 
    handlefilterchange={handleFilterChange} 
    />
    <Countries 
    countries={showCountries}
    showcountrybutton={showCountryButton} />
    </div>
  )
}

const Filter = ({newfilter, handlefilterchange}) => {
return (
  <div>
  find countries <input value={newfilter} onChange={handlefilterchange} />
  </div>
)}

const Countries = ({countries, showcountrybutton}) => {
  if (countries.length > 10) {
    return(
      <div>
      Too many matches, use more specific filter
      </div>
  )} else if ( countries.length > 1) { 
    console.log(countries);
  return (
    <ul>
    {countries.map(country =>
      <Country
      key={country.cca3} 
      name={country.name.common}
      showbutton={showcountrybutton} />
    )}
    </ul>
  )} else {
    return(
      <CountryInfo country={countries[0]} />
    )}
}

const CountryInfo = ({country}) => {
  return (
    <div>
    <h1>
    {country.name.common}  
    </h1>
    <ul>
    <li>Capital: {country.capital[0]}</li>
    <li>Area: {country.area}m2</li>
    </ul>
    <h3> languages: </h3>
    <Languages 
    languages={Object.values(country.languages)} />
    <img src={country.flags.png} alt="flag" />
    </div>
)}

const Language = ({name}) => {
  return (
    <li>
    {name}
    </li>
)}
const Country = ({name, showbutton}) => {
  return (
    <li>
    {name}
    <button 
    type="button" 
    onClick={() => {showbutton(name)}}>
    show
    </button>
    </li>
)}

const Languages = ({languages}) => {
  console.log(languages);
  return(
    <ul>
    {languages.map(language =>
      <Language
      key={language} 
      name={language} />
    )}
    </ul>
  )}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

export default App
