const KEY = 'parallax-scenarios'

export const scenarioStore = {
  list() {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  },

  create(scenario) {
    const item = {
      ...scenario,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(
      KEY,
      JSON.stringify([item, ...scenarioStore.list()]),
    )

    return item
  },

  update(id, changes) {
    const updated = scenarioStore.list().map((item) =>
      item.id === id ? { ...item, ...changes } : item,
    )

    localStorage.setItem(KEY, JSON.stringify(updated))
  },

  remove(id) {
    const remaining = scenarioStore
      .list()
      .filter((item) => item.id !== id)

    localStorage.setItem(KEY, JSON.stringify(remaining))
  },
}