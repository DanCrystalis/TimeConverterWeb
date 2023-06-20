const { DateTime, IANAZone } = luxon;

const locationSelect = document.getElementById('locationSelect');
const currentTimeInput = document.getElementById('currentTime');
const currentDateInput = document.getElementById('currentDate');
const currentLocationInput = document.getElementById('currentLocation');
const convertedTimesTextarea = document.getElementById('convertedTimes');
const fmgButton = document.getElementById('fmgButton');
const convertButton = document.getElementById('convertButton');
const searchInput = document.getElementById('searchInput');

let locations = [];

fetch('TimezoneList.json')
  .then(response => response.json())
  .then(data => {
    locations = data;
    populateLocationSelect(locations);
  })
  .catch(error => {
    console.error('Error fetching timezones:', error);
  });

const currentLuxon = DateTime.now();
currentTimeInput.value = currentLuxon.toFormat('HH:mm');
currentDateInput.value = currentLuxon.toFormat('yyyy-MM-dd');
currentLocationInput.value = currentLuxon.zoneName;

fmgButton.addEventListener('click', handleFMGButtonClick);
convertButton.addEventListener('click', handleConvertButtonClick);
searchInput.addEventListener('input', handleSearchInputChange);

function handleFMGButtonClick() {
  const fmgLocations = [
    'Pacific/Honolulu',
    'America/Los_Angeles',
    'America/Guatemala',
    'America/Mexico_City',
    'America/New_York',
    'America/Guayaquil',
    'America/Lima',
    'America/Halifax',
    'America/Sao_Paulo',
    'Europe/London',
    'Africa/Porto-Novo',
    'Europe/Stockholm',
    'Africa/Johannesburg',
    'Africa/Cairo',
    'Africa/Nairobi',
    'Asia/Kolkata',
    'Asia/Shanghai',
    'Australia/Brisbane'
  ];

  const convertedTimes = performConversion(fmgLocations);
  appendConvertedTimes(convertedTimes);
  selectLocations(fmgLocations);
}

function handleConvertButtonClick() {
  const selectedLocations = getSelectedLocations();
  const convertedTimes = performConversion(selectedLocations);
  appendConvertedTimes(convertedTimes);
}

function handleSearchInputChange() {
  const searchQuery = searchInput.value.toLowerCase();
  const filteredLocations = locations.filter(location =>
    location.label.toLowerCase().includes(searchQuery)
  );
  populateLocationSelect(filteredLocations);
}

function appendConvertedTimes(convertedTimes) {
  convertedTimes.forEach(time => {
    convertedTimesTextarea.value += time + '\n\n';
  });
}

function populateLocationSelect(locations) {
  locationSelect.innerHTML = '';
  locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location.tzCode;
    option.textContent = `${location.label} ${location.utc}`;
    locationSelect.appendChild(option);
  });
}

function selectLocations(locations) {
  Array.from(locationSelect.options).forEach(option => {
    option.selected = locations.includes(option.value);
  });
}

function getSelectedLocations() {
  return Array.from(locationSelect.options)
    .filter(option => option.selected)
    .map(option => option.value);
}

function performConversion(locations) {
  const convertedTimes = [];
  const primaryTime = currentLuxon.setZone('local').setLocale('en').toFormat('HH:mm');

  locations.forEach(location => {
    const zone = new IANAZone(location);
    const convertedTime = currentLuxon.setZone(zone).setLocale('en').toFormat('HH:mm, yyyy-MM-dd');
    convertedTimes.push(`${location}: ${convertedTime}`);
  });

  return convertedTimes;
}
