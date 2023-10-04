import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name/'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data);
}

const getCountry = (countryName) => {
  const request = axios.get(countryUrl+{countryName});
  return request.then(response => response.data);
}

export default { 
  getAll: getAll, 
  getCountry: getCountry,
}
