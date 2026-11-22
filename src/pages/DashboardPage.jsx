import { useMemo, useState } from 'react'
import { INITIAL_ZONES, simulate } from '../utils/simulation'
import { scenarioStore } from '../services/scenarioStore'
import { useAuth } from '../context/useAuth'
import MetricCard from '../components/MetricCard'

export default function DashboardPage() {
    const { logout } = useAuth()
    const [growth, setGrowth] = useState(12)
    const [roadCapacity, setRoadCapacity] = useState(0)
    const [saved, setSaved] = useState(() => scenarioStore.list())

    const result = useMemo(
        () =>
            simulate(
                INITIAL_ZONES,
                growth,
                roadCapacity,
            ),
        [growth, roadCapacity],
    )

    const saveScenario = () => {
        const scenario = scenarioStore.create({
            name: `${growth}% growth`,
            growth,
            roadCapacity,
            result,
        })

        setSaved((current) => [
            scenario,
            ...current,
        ])
    }

    const removeScenario = (id) => {
        scenarioStore.remove(id)
        setSaved((current) =>
            current.filter((item) => item.id !== id),
        )
    }

    return (
        <main>
            <h1>Regional Growth Model</h1>

            <label>
                Population growth: {growth}%
                <input
                    type="range"
                    min="0"
                    max="60"
                    value={growth}
                    onChange={(event) =>
                        setGrowth(Number(event.target.value))
                    }
                />
            </label>

            <label>
                Road capacity: {roadCapacity.toLocaleString()}
                <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={roadCapacity}
                    onChange={(event) =>
                        setRoadCapacity(Number(event.target.value))
                    }
                />
            </label>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    label="Population"
                    value={result.totalPopulation.toLocaleString()}
                    detail={`+${growth}%`}
                    tone="blue"
                />

                <MetricCard
                    label="Congestion"
                    value={`${result.congestionPercent}%`}
                    detail={result.status}
                    tone={result.status === 'Critical' ? 'red' : 'orange'}
                />

                <MetricCard
                    label="Facilities needed"
                    value={result.infrastructureDemand}
                    detail="Estimated"
                    tone="green"
                />
            </section>

            <section>
                <p>
                    Population:{' '}
                    {result.totalPopulation.toLocaleString()}
                </p>
                <p>
                    Trips:{' '}
                    {result.totalTrips.toLocaleString()}
                </p>
                <p>Congestion: {result.congestionPercent}%</p>
                <p>Facilities: {result.infrastructureDemand}</p>
                <p>Status: {result.status}</p>
                <p>
                    Bottlenecks:{' '}
                    {result.bottlenecks.join(', ') ||
                        'None'}
                </p>
            </section>

            <button onClick={saveScenario}>
                Save scenario
            </button>

            <button onClick={logout}>
                Logout
            </button>

            <section>
                <h2>Saved scenarios</h2>

                {saved.length === 0 && (
                    <p>No saved scenarios.</p>
                )}

                {saved.map((scenario) => (
                    <article key={scenario.id}>
                        <strong>{scenario.name}</strong>
                        <button
                            onClick={() =>
                                removeScenario(scenario.id)
                            }
                        >
                            Delete
                        </button>
                    </article>
                ))}
            </section>
        </main>
    )
}