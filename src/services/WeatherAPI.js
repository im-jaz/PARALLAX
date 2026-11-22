export async function fetchCityWeather(
  city = 'London',
) {
  const locations = {
    London: [51.5072, -0.1276],
    Manchester: [53.4808, -2.2426],
    Bristol: [51.4545, -2.5879],
  }

  const [latitude, longitude] =
    locations[city] || locations.London

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,precipitation`,
  )

  if (!response.ok) {
    throw new Error('Weather service unavailable')
  }

  const data = await response.json()
  return data.current
}