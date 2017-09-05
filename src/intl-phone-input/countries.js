// Based on react-intl-tel-input v4.2.0 with russian translating, list sorting & some formatting.
// https://github.com/patw0929/react-intl-tel-input/blob/master/src/components/AllCountries.js

// Array of country objects for the flag dropdown.
// Each contains a name, country code (ISO 3166-1 alpha-2) and dial code.

// Originally from https://github.com/mledoze/countries
// then with a couple of manual re-arrangements to be alphabetical
// then changed Kazakhstan from +76 to +7
// and Vatican City from +379 to +39 (see issue 50)
// and Caribean Netherlands from +5997 to +599
// and Curacao from +5999 to +599
// Removed:  Kosovo, Pitcairn Islands, South Georgia

// UPDATE Sept 12th 2015
// List of regions that have iso2 country codes, which I have chosen to omit:
// (based on this information: https://en.wikipedia.org/wiki/List_of_country_calling_codes)
// AQ - Antarctica - all different country codes depending on which 'base'
// BV - Bouvet Island - no calling code
// GS - South Georgia and the South Sandwich Islands -
// 'inhospitable collection of islands' - same flag and calling code as Falkland Islands
// HM - Heard Island and McDonald Islands - no calling code
// PN - Pitcairn - tiny population (56), same calling code as New Zealand
// TF - French Southern Territories - no calling code
// UM - United States Minor Outlying Islands - no calling code

// UPDATE the criteria of supported countries or territories (see issue 297)
// Have an iso2 code: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
// Have a country calling code: https://en.wikipedia.org/wiki/List_of_country_calling_codes
// Have a flag
// Must be supported by libphonenumber: https://github.com/googlei18n/libphonenumber

// Update: converted objects to arrays to save bytes!
// Update: added 'priority' for countries with the same dialCode as others
// Update: added array of area codes for countries with the same dialCode as others

// So each country array has the following information:
// [
//    Country name,
//    iso2 code,
//    International dial code,
//    Order (if >1 country with same dial code),
//    Area codes (if >1 country with same dial code)
// ]
const defaultCountriesData = require('./countries.json');

let countries;

function formatCountriesData(countriesData) {
    return countriesData.map(country => ({
        name: country[0],
        iso2: country[1],
        dialCode: country[2],
        priority: country[3] || 0,
        areaCodes: country[4] || null
    }));
}

function initialize(externalCountriesList) {
    countries = formatCountriesData(externalCountriesList || defaultCountriesData);
}

function getCountries() {
    if (!countries) {
        initialize();
    }

    return countries;
}

const AllCountries = {
    initialize,
    getCountries
};

export default AllCountries;
