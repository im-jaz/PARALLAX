import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchCityWeather } from '../services/WeatherAPI'
import { useAuth } from '../context/useAuth'
import { scenarioStore } from '../services/scenarioStore'
import { INITIAL_ZONES, simulate } from '../utils/simulation'
import { Activity, Building2, Route, Users } from 'lucide-react'
import {
  Activity,
  Building2,
  ChevronRight,
  Crosshair,
  Leaf,
  LogOut,
  MapPin,
  Route,
  Save,
  Trash2,
  Users,
} from 'lucide-react'

const POSITIONS = {
  Northbank: ['24%', '25%'], Central: ['51%', '43%'], Riverside: ['72%', '68%'], 'West End': ['27%', '72%'],
}

function Control({ label, value, suffix, min, max, step = 1, onChange, hint }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block border-b border-white/[0.07] py-3 last:border-0">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300">{label}</span>
        <strong className="font-mono text-sm text-amber-300">{value}{suffix}</strong>
      </span>
      <input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="command-range mt-3 w-full" style={{ '--range-progress': `${pct}%` }} />
      {hint && <span className="mt-1 block text-[9px] text-slate-600">{hint}</span>}
    </label>
  )
}

function MetricStrip({ label, value, delta, icon: Icon }) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-r border-white/[0.07] px-3 py-4 last:border-0">
      <Icon size={16} className="shrink-0 text-cyan-400" />
      <div className="min-w-0">
        <p className="truncate text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">{label}</p>
        <strong className="mt-1 block font-mono text-lg text-slate-100">{value}</strong>
        <small className="text-[9px] text-amber-300">{delta}</small>
      </div>
    </div>
  )
}

function Pressure({ label, value }) {
  const safeValue = Math.max(0, Math.min(100, value))
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between text-[10px]">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-slate-300">{Math.round(safeValue)}%</span>
      </div>
      <div className="h-1 bg-white/5"><div className={`h-full ${safeValue > 90 ? 'bg-red-400' : safeValue > 70 ? 'bg-amber-400' : 'bg-cyan-400'}`} style={{ width: `${safeValue}%` }} /></div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const nameRef = useRef(null)
  const [scenarioName, setScenarioName] = useState('Central expansion 2036')
  const [growth, setGrowth] = useState(18)
  const [roadInvestment, setRoadInvestment] = useState(50000)
  const [horizon, setHorizon] = useState(10)
  const [transit, setTransit] = useState(25)
  const [greenLand, setGreenLand] = useState(15)
  const [housing, setHousing] = useState(8)
  const [efficiency, setEfficiency] = useState(20)
  const [zoneGrowth, setZoneGrowth] = useState({ Northbank: 0, Central: 8, Riverside: 4, 'West End': -3 })
  const [zone, setZone] = useState('Central')
  const [saved, setSaved] = useState(() => scenarioStore.list())
  const [status, setStatus] = useState(() => 'Model archive online')
  const [weather, setWeather] = useState(null)

  const settings = useMemo(() => ({ growthPercent: growth, additionalRoadCapacity: roadInvestment, horizon, transitInvestment: transit, greenLand, publicHousing: housing, efficiency, zoneGrowth }), [growth, roadInvestment, horizon, transit, greenLand, housing, efficiency, zoneGrowth])
  const baseline = useMemo(() => simulate(INITIAL_ZONES, 0, 0), [])
  const scenario = useMemo(() => simulate(INITIAL_ZONES, settings), [settings])

  useEffect(() => {
    const city = zone === 'Riverside' ? 'Bristol' : zone === 'Northbank' ? 'Manchester' : 'London'
    fetchCityWeather(city).then(setWeather).catch(() => setWeather(null))
  }, [zone])

  const save = () => {
    setStatus('Writing archive…')
    const item = scenarioStore.create({ name: scenarioName.trim() || `Scenario ${zone}`, growth, roadCapacity: roadInvestment, horizon, transit, greenLand, housing, efficiency, zoneGrowth, zone, result: scenario })
    setSaved((items) => [item, ...items])
    setStatus('Scenario committed')
  }

  const load = (item) => {
    setScenarioName(item.name)
    setGrowth(item.growth || 0)
    setRoadInvestment(item.roadCapacity || 0)
    setHorizon(item.horizon || 10)
    setTransit(item.transit || 0)
    setGreenLand(item.greenLand || 0)
    setHousing(item.housing || 0)
    setEfficiency(item.efficiency || 0)
    setZoneGrowth(item.zoneGrowth || { Northbank: 0, Central: 0, Riverside: 0, 'West End': 0 })
    setZone(item.zone || 'Central')
    setStatus('Scenario restored')
    nameRef.current?.focus()
  }

  const remove = (id) => {
    scenarioStore.remove(id)
    setSaved((items) => items.filter((item) => item.id !== id))
    setStatus('Record erased')
  }

  const selected = scenario.zones.find((item) => item.name === zone) || scenario.zones[0]
  const populationDelta = scenario.totalPopulation - baseline.totalPopulation
  const congestionDelta = scenario.congestionPercent - baseline.congestionPercent

  return (
    <main className="command-shell min-h-screen overflow-x-hidden text-slate-200">
      <header className="command-header flex h-[76px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="parallax-mark">PX</div>
          <div><p className="text-[9px] font-bold uppercase tracking-[0.32em] text-cyan-400">Metropolitan response lab</p><h1 className="mt-1 text-base font-black tracking-[0.08em] text-white md:text-lg">PARALLAX / CITY-01</h1></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 border-r border-white/10 pr-4 text-right md:flex">
            <div><p className="text-[9px] uppercase tracking-widest text-slate-500">Live operator</p><p className="text-xs font-bold text-slate-200">{user?.name || 'Analyst'}</p></div>
            <button onClick={logout} aria-label="Sign out" className="grid h-9 w-9 place-items-center border border-white/10 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300">OUT</button>
          </div>
          <button onClick={save} className="commit-button flex h-10 items-center gap-2 px-3 md:px-5"><span className="text-xs font-black uppercase tracking-wider">Commit scenario</span></button>
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[280px_minmax(480px,1fr)_300px]">
        <aside className="command-panel border-r border-white/[0.08] p-4">
          <div className="panel-label">01 / Scenario parameters</div>
          <label className="mt-3 block"><span className="sr-only">Scenario name</span><input ref={nameRef} value={scenarioName} onChange={(event) => setScenarioName(event.target.value)} className="scenario-name w-full" /></label>
          <Control label="Projection horizon" value={horizon} suffix=" yr" min={1} max={30} onChange={setHorizon} hint="Forecast period" />
          <Control label="Regional growth" value={growth} suffix="%" min={0} max={60} onChange={setGrowth} hint="Population arrival across all zones" />
          <Control label="Road expansion" value={roadInvestment / 1000} suffix="k" min={0} max={200} step={10} onChange={(value) => setRoadInvestment(value * 1000)} hint="Network capacity investment" />
          <Control label="Transit conversion" value={transit} suffix="%" min={0} max={100} onChange={setTransit} hint="Modal share shifted to public transit" />
          <Control label="Public housing" value={housing} suffix=" blocks" min={0} max={20} onChange={setHousing} hint="Adds 250 dwellings per block" />
          <Control label="Green allocation" value={greenLand} suffix="%" min={0} max={40} onChange={setGreenLand} hint="Land reserved for green infrastructure" />
          <Control label="Operations efficiency" value={efficiency} suffix="%" min={0} max={100} onChange={setEfficiency} hint="System-wide service optimisation" />
        </aside>
        <section className="relative flex min-h-[620px] flex-col border-r border-white/[0.08]">
          <div className="flex h-12 items-center justify-between border-b border-white/[0.08] px-4"><div className="panel-label !mb-0">02 / Spatial execution map</div><div className="flex items-center gap-3 font-mono text-[9px] text-slate-500"><span className="text-emerald-400">● LIVE</span><span>GRID 04×04</span></div></div>
          <div className="urban-map relative flex-1 overflow-hidden">
            <div className="map-grid absolute inset-0" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 620" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-40 470 C150 380 180 170 390 250 S610 430 840 140" className="network-route" /><path d="M180 -30 C240 160 160 330 270 650" className="network-route muted" /><path d="M530 -30 C480 150 640 260 590 650" className="network-route muted" />
            </svg>

            {scenario.zones.map((item) => {
              const [left, top] = POSITIONS[item.name]
              const localLoad = item.population * item.tripRate / (item.roadCapacity + roadInvestment / 4)
              const state = localLoad > 1 ? 'critical' : localLoad > 0.82 ? 'pressure' : 'stable'
              return (
                <button key={item.id} onClick={() => setZone(item.name)} style={{ left, top }} className={`zone-node ${state} ${zone === item.name ? 'selected' : ''}`}>
                  <span className="zone-pulse" /><span className="zone-dot" /><span className="zone-copy"><strong>{item.name}</strong><small>{Math.round(item.population / 1000)}K RES</small></span>
                </button>
              )
            })}

            <div className="selected-zone-card">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-400">Selected sector</p>
              <h2 className="mt-1 text-xl font-black text-white">{selected.name}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div><small>Population</small><strong>{Math.round(selected.population / 1000)}K</strong></div>
                <div><small>Network</small><strong>{scenario.status}</strong></div>
                <div><small>Housing</small><strong>{Math.round(scenario.housingPressure * 100)}%</strong></div>
              </div>
              <div className="mt-4"><input aria-label={`${selected.name} growth bias`} type="range" min={-10} max={30} value={zoneGrowth[selected.name] || 0} onChange={(event) => setZoneGrowth((current) => ({ ...current, [selected.name]: Number(event.target.value) }))} className="command-range w-full" /></div>
            </div>
          </div>

          <div className="grid h-[128px] grid-cols-2 border-t border-white/[0.08] md:grid-cols-4">
            <MetricStrip
              label="Projected population"
              value={scenario.totalPopulation.toLocaleString()}
              delta={`${populationDelta >= 0 ? '+' : ''}${populationDelta.toLocaleString()}`}
              icon={Users}
            />

            <MetricStrip
              label="Network load"
              value={`${Math.round(scenario.trafficLoad * 100)}%`}
              delta={`${congestionDelta >= 0 ? '+' : ''}${congestionDelta}%`}
              icon={Route}
            />

            <MetricStrip
              label="System resilience"
              value={`${scenario.resilience}/100`}
              delta={scenario.status}
              icon={Activity}
            />

            <MetricStrip
              label="Annual programme"
              value={`£${scenario.annualCost.toFixed(1)}M`}
              delta={`${scenario.bottlenecks.length} critical`}
              icon={Building2}
            />
          </div>
        </section>

        <aside className="command-panel p-4">
          <div className="panel-label">03 / Response analysis</div>
          <div className="mt-4 border border-cyan-300/10 bg-cyan-300/[0.03] p-4">
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Resilience index</p>
            <strong className="mt-1 block font-mono text-4xl text-cyan-300">{scenario.resilience}</strong>
            <div className="mt-4 h-1 bg-white/5"><div className="h-full bg-cyan-300" style={{ width: `${scenario.resilience}%` }} /></div>
          </div>

          <div className="mt-3 border border-white/[0.07] p-4">
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Critical sectors</p>
            {scenario.bottlenecks.length ? (
              <div className="mt-3 space-y-2">{scenario.bottlenecks.map((name) => <button key={name} onClick={() => setZone(name)} className="flex w-full items-center justify-between border-l-2 border-amber-400 bg-amber-300/[0.04] px-3 py-2 text-left text-xs"><span>{name}</span><span>›</span></button>)}</div>
            ) : <p className="mt-3 text-xs text-emerald-300">No critical sector identified</p>}
          </div>

          <div className="mt-3 border border-white/[0.07] p-4">
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Pressure profile</p>
            <Pressure label="Transport" value={scenario.trafficLoad * 100} /><Pressure label="Housing" value={scenario.housingPressure * 100} /><Pressure label="Facilities" value={Math.min(100, scenario.infrastructureDemand * 4)} />
          </div>

          <div className="mt-3 border border-white/[0.07] p-4">
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Environmental context</p>
            {weather ? <p className="mt-3 font-mono text-sm text-slate-300">{zone.toUpperCase()} / {weather.temperature_2m}°C / {weather.precipitation}mm</p> : <p className="mt-3 text-xs text-slate-600">Retrieving external context…</p>}
          </div>

          <div id="saved-scenarios" className="mt-3 border border-white/[0.07] p-4">
            <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">Archive</p><span className="text-[9px] text-cyan-400">{status}</span></div>
            {saved.length ? (
              <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">{saved.map((item) => <div key={item.id} className="flex items-center border border-white/[0.07] p-2"><button onClick={() => load(item)} className="min-w-0 flex-1 text-left"><strong className="block truncate text-[11px] text-slate-200">{item.name}</strong><small className="text-[9px] text-slate-600">H{item.horizon || 10} / G{item.growth || 0}%</small></button><button onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`} className="p-2 text-slate-600 hover:text-red-400">×</button></div>)}</div>
            ) : <p className="mt-3 text-xs text-slate-600">No committed records.</p>}
          </div>
        </aside>
      </div>
    </main>
  )
}