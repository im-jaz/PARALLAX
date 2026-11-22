import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MetricCard from './MetricCard'

describe('MetricCard', () => {
  it('renders a label, value, and detail', () => {
    render(createElement(MetricCard, {
      label: 'Population',
      value: '196,000',
      detail: '+12%',
      tone: 'blue',
    }))

    expect(screen.getByText('Population')).toBeInTheDocument()
    expect(screen.getByText('196,000')).toBeInTheDocument()
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })
})
