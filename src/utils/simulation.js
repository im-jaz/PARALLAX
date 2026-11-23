export const INITIAL_ZONES = [
  { id: 1, name: 'Northbank', population: 42000, tripsPerPerson: 1.8, roadCapacity: 150000, housingUnits: 1800, schoolCapacity: 9000, clinicCapacity: 3800, color: '#25d7c5' },
  { id: 2, name: 'Central', population: 68000, tripsPerPerson: 2.1, roadCapacity: 220000, housingUnits: 2900, schoolCapacity: 12000, clinicCapacity: 5200, color: '#ffb454' },
  { id: 3, name: 'Riverside', population: 35000, tripsPerPerson: 1.6, roadCapacity: 110000, housingUnits: 1400, schoolCapacity: 7000, clinicCapacity: 3000, color: '#62a7ff' },
  { id: 4, name: 'West End', population: 51000, tripsPerPerson: 1.9, roadCapacity: 180000, housingUnits: 2100, schoolCapacity: 9500, clinicCapacity: 4200, color: '#d783ff' }
]

export function simulate(zones, growthPercent = 0, additionalRoadCapacity = 0, options = {}) {
  const settings = typeof growthPercent === 'object'
    ? growthPercent
    : { growthPercent, additionalRoadCapacity, ...options }

  const globalGrowth = settings.growthPercent || 0
  const roadInvestment = settings.additionalRoadCapacity || additionalRoadCapacity || 0
  const horizon = settings.horizon || 10
  const transitInvestment = settings.transitInvestment || 0
  const greenLand = settings.greenLand || 0
  const publicHousing = settings.publicHousing || 0
  const efficiency = settings.efficiency || 0
  const zoneGrowth = settings.zoneGrowth || {}

  const adjusted = zones.map((zone) => {
    const zonePercent = zoneGrowth[zone.name] || 0
    const horizonMultiplier = 1 + (horizon - 1) / 30
    const population = Math.round(zone.population * (1 + ((globalGrowth + zonePercent) / 100) * horizonMultiplier))
    const housing = zone.housingUnits + publicHousing * 250
    const tripReduction = 1 - (transitInvestment / 100) * 0.42
    const efficiencyReduction = 1 - (efficiency / 100) * 0.22

    return {
      ...zone,
      population,
      housing,
      tripRate: zone.tripsPerPerson * tripReduction * efficiencyReduction,
      schoolPressure: (population * 0.31) / (zone.schoolCapacity + publicHousing * 300),
      clinicPressure: (population * 0.08) / (zone.clinicCapacity + publicHousing * 170),
    }
  })

  const baseRoadCapacity = zones.reduce((sum, zone) => sum + zone.roadCapacity, 0)
  const transitCapacity = baseRoadCapacity * (transitInvestment / 100) * 0.75
  const roadCapacity = baseRoadCapacity + roadInvestment + transitCapacity
  const totalTrips = adjusted.reduce((sum, zone) => sum + zone.population * zone.tripRate, 0)
  const trafficLoad = roadCapacity ? totalTrips / roadCapacity : 1
  const housingCapacity = adjusted.reduce((sum, zone) => sum + zone.housing, 0)
  const totalPopulation = adjusted.reduce((sum, zone) => sum + zone.population, 0)
  const housingPressure = housingCapacity ? totalPopulation / (housingCapacity * 2.35) : 1

  const bottlenecks = adjusted.filter((zone) => {
    const zoneTraffic = zone.population * zone.tripRate
    const zoneCapacity = zone.roadCapacity + roadInvestment / zones.length + transitCapacity / zones.length
    return zoneTraffic / zoneCapacity > 0.82 || zone.schoolPressure > 1 || zone.clinicPressure > 1
  }).map((zone) => zone.name)

  const infrastructureDemand = Math.round(adjusted.reduce((sum, zone) => sum + zone.schoolPressure + zone.clinicPressure, 0) * 8)
  const annualCost = Math.round((roadInvestment * 0.0032 + transitInvestment * 8.5 + publicHousing * 4.2 + efficiency * 3.1) * 100) / 100
  const resilience = Math.max(18, Math.round(100 - trafficLoad * 48 - housingPressure * 22 - bottlenecks.length * 5 + greenLand * 1.2 + efficiency * 0.6))

  return {
    zones: adjusted,
    totalPopulation,
    totalTrips: Math.round(totalTrips),
    roadCapacity: Math.round(roadCapacity),
    trafficLoad,
    congestionPercent: Math.round(Math.max(0, trafficLoad * 100 - 68)),
    infrastructureDemand,
    housingPressure,
    bottlenecks,
    annualCost,
    resilience,
    status: trafficLoad > 1 ? 'Critical' : trafficLoad > 0.82 ? 'High pressure' : 'Stable'
  }
}