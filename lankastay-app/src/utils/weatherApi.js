export function getWeatherDetails(code) {
  if (code === 0) return { text: 'Clear Sky', icon: 'fa-solid fa-sun' };
  if ([1, 2, 3].includes(code)) return { text: 'Partly Cloudy', icon: 'fa-solid fa-cloud-sun' };
  if ([45, 48].includes(code)) return { text: 'Foggy', icon: 'fa-solid fa-smog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { text: 'Drizzle', icon: 'fa-solid fa-cloud-rain' };
  if ([61, 63, 65, 66, 67].includes(code)) return { text: 'Rain Showers', icon: 'fa-solid fa-cloud-showers-heavy' };
  if ([71, 73, 75, 77].includes(code)) return { text: 'Snow', icon: 'fa-solid fa-snowflake' };
  if ([95, 96, 99].includes(code)) return { text: 'Thunderstorm', icon: 'fa-solid fa-cloud-bolt' };
  return { text: 'Season Active', icon: 'fa-solid fa-cloud-sun' };
}

export function getDayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export async function fetchLiveWeather() {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.9271&longitude=79.8612&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto');
    const data = await response.json();

    const currentTemp = Math.round(data.current.temperature_2m);
    const weatherInfo = getWeatherDetails(data.current.weather_code);

    const dates = data.daily.time;
    const maxTemps = data.daily.temperature_2m_max;
    const minTemps = data.daily.temperature_2m_min;
    const codes = data.daily.weather_code;

    return {
      currentTemp,
      weatherDesc: weatherInfo.text,
      weatherIcon: weatherInfo.icon,
      day1Name: getDayName(dates[1]),
      day1Max: Math.round(maxTemps[1]),
      day1Min: Math.round(minTemps[1]),
      day1Icon: getWeatherDetails(codes[1]).icon,
      day1Text: getWeatherDetails(codes[1]).text,
      day2Name: getDayName(dates[2]),
      day2Max: Math.round(maxTemps[2]),
      day2Min: Math.round(minTemps[2]),
      day2Icon: getWeatherDetails(codes[2]).icon,
      day2Text: getWeatherDetails(codes[2]).text,
    };
  } catch (error) {
    console.error('Error fetching live weather data:', error);
    return null;
  }
}