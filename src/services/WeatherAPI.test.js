import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCityWeather } from './weatherApi'

afterEach(() => vi.restoreAllMocks())

describe('weather API', () => {
  it('returns current weather', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          current: { temperature_2m: 18 },
        }),
      }),
    )

    const weather = await fetchCityWeather('London')
    expect(weather.temperature_2m).toBe(18)
  })

  it('handles API failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false }),
    )

    await expect(
      fetchCityWeather('London'),
    ).rejects.toThrow(
      'Weather service unavailable',
    )
  })
})