import { beforeEach, describe, expect, it } from 'vitest'
import { scenarioStore } from './scenarioStore'

describe('scenario storage', () => {
  beforeEach(() => localStorage.clear())

  it('creates and lists a scenario', () => {
    scenarioStore.create({ name: 'Growth test', growth: 20 })

    expect(scenarioStore.list()).toHaveLength(1)
  })

  it('updates a scenario', () => {
    const scenario = scenarioStore.create({
      name: 'Old name',
    })

    scenarioStore.update(scenario.id, {
      name: 'New name',
    })

    expect(scenarioStore.list()[0].name).toBe('New name')
  })

  it('deletes a scenario', () => {
    const scenario = scenarioStore.create({
      name: 'Delete test',
    })

    scenarioStore.remove(scenario.id)

    expect(scenarioStore.list()).toHaveLength(0)
  })
})