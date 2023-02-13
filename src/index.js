import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

import fetchCountries from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(changeHandler, DEBOUNCE_DELAY));

function changeHandler(event) {
    const value = event.target.value.trim();
    cleanMarkup()

    if (!value) {
        return;
      }

    fetchCountries(value).then(data => {
        if (data.length <= 1) {
          countryInfoMarkup(data);
        } else if (data.length <= 10) {
          countriesListMarkup(data);
        } else {
          Notiflix.Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
}

function countriesListMarkup(data) {
  const markup = data
    .map(el => {
      return `<li>
        <img src="${el.flags.svg}"></img>
        <p><strong>${el.name}</strong></p>
                </li>`;
    })
    .join('');
  refs.countryListEl.innerHTML = markup;

}

function countryInfoMarkup(data) {
  const languagesArr = data[0].languages
    .map(el => {
      return el.name;
    })
    .join(', ');
  const markup = `<div class="flagNameContainer"><img src="${data[0].flags.svg}"></img>
    <h1>${data[0].name}</h1></div>
    <p><strong>Capital:</strong> ${data[0].capital}</p>
    <p><strong>Population:</strong> ${data[0].population}</p>
    <p><strong>Languages:</strong> ${languagesArr}</p>`;
  refs.countryInfoEl.innerHTML = markup;

}

function cleanMarkup() {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEl.innerHTML = '';
  }


