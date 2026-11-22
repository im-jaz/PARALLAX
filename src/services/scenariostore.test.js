import { describe, expect, it } from 'vitest'
import { INITIAL_ZONES, simulate } from './simulation'

describe('simulation engine', () => {
  it('increases population with growth', () => {
    const baseline = simulate(INITIAL_ZONES, 0, 0)
    const growth = simulate(INITIAL_ZONES, 20, 0)

    expect(growth.totalPopulation).toBeGreaterThan(
      baseline.totalPopulation,
    )
  })

  it('reduces traffic load when road capacity is added', () => {
    const original = simulate(INITIAL_ZONES, 40, 0)
    const expanded = simulate(INITIAL_ZONES, 40, 200000)

    expect(expanded.trafficLoad).toBeLessThan(
      original.trafficLoad,
    )
  })

  it('is deterministic', () => {
    expect(
      simulate(INITIAL_ZONES, 12, 50000),
    ).toEqual(
      simulate(INITIAL_ZONES, 12, 50000),
    )
  })
})