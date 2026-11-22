export const INITIAL_ZONES = [
  {
    id: 1,
    name: 'Northbank',
    population: 42000,
    tripsPerPerson: 1.8,
    roadCapacity: 150000,
  },
  {
    id: 2,
    name: 'Central',
    population: 68000,
    tripsPerPerson: 2.1,
    roadCapacity: 220000,
  },
  {
    id: 3,
    name: 'Riverside',
    population: 35000,
    tripsPerPerson: 1.6,
    roadCapacity: 110000,
  },
  {
    id: 4,
    name: 'West End',
    population: 51000,
    tripsPerPerson: 1.9,
    roadCapacity: 180000,
  },
]

// Runs the same calculations every time using the supplied inputs.
export function simulate(zones, growthPercent = 0, additionalRoadCapacity = 0) {
  const growthMultiplier = 1 + growthPercent / 100

  const adjustedZones = zones.map((zone) => ({
    ...zone,
    population: Math.round(zone.population * growthMultiplier),
  }))

  const totalPopulation = adjustedZones.reduce(
    (total, zone) => total + zone.population,
    0,
  )

  const totalTrips = adjustedZones.reduce(
    (total, zone) => total + zone.population * zone.tripsPerPerson,
    0,
  )

  const roadCapacity =
    adjustedZones.reduce(
      (total, zone) => total + zone.roadCapacity,
      0,
    ) + additionalRoadCapacity

  const trafficLoad = roadCapacity
    ? totalTrips / roadCapacity
    : 1

  const congestionPercent = Math.round(
    Math.max(0, trafficLoad * 100 - 68),
  )

  const infrastructureDemand = Math.round(
    totalPopulation * 0.0009,
  )

  const bottlenecks = adjustedZones
    .filter((zone) => {
      const zoneTrips =
        zone.population * zone.tripsPerPerson

      const zoneCapacity =
        zone.roadCapacity + additionalRoadCapacity / adjustedZones.length

      return zoneTrips / zoneCapacity > 0.82
    })
    .map((zone) => zone.name)

  return {
    zones: adjustedZones,
    totalPopulation,
    totalTrips: Math.round(totalTrips),
    roadCapacity: Math.round(roadCapacity),
    trafficLoad,
    congestionPercent,
    infrastructureDemand,
    bottlenecks,
    status:
      trafficLoad > 1
        ? 'Critical'
        : trafficLoad > 0.82
          ? 'High pressure'
          : 'Stable',
  }
}