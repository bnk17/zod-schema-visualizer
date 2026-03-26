import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SchemaInput } from 'src/features/schema-visualizer/components/SchemaInput'
import { PRESETS } from 'src/features/schema-visualizer/presets'

function renderSchemaInput(overrides: Partial<React.ComponentProps<typeof SchemaInput>> = {}) {
  const props = {
    value: '',
    onChange: vi.fn(),
    onVisualize: vi.fn(),
    onPresetSelect: vi.fn(),
    error: null,
    ...overrides,
  }
  render(<SchemaInput {...props} />)
  return props
}

describe('SchemaInput', () => {
  describe('rendering', () => {
    it('renders the schema textarea', () => {
      renderSchemaInput()
      expect(screen.getByRole('textbox', { name: /zod schema input/i })).toBeInTheDocument()
    })

    it('renders all preset buttons', () => {
      renderSchemaInput()
      for (const preset of PRESETS) {
        expect(screen.getByRole('button', { name: preset.label })).toBeInTheDocument()
      }
    })

    it('renders the Visualize button', () => {
      renderSchemaInput()
      expect(screen.getByRole('button', { name: /visualize/i })).toBeInTheDocument()
    })
  })

  describe('Visualize button disabled state', () => {
    it('is disabled when value is empty', () => {
      renderSchemaInput({ value: '' })
      expect(screen.getByRole('button', { name: /visualize/i })).toBeDisabled()
    })

    it('is disabled when value is whitespace only', () => {
      renderSchemaInput({ value: '   ' })
      expect(screen.getByRole('button', { name: /visualize/i })).toBeDisabled()
    })

    it('is enabled when value has content', () => {
      renderSchemaInput({ value: 'z.object({ name: z.string() })' })
      expect(screen.getByRole('button', { name: /visualize/i })).toBeEnabled()
    })
  })

  describe('error display', () => {
    it('shows error message when error prop is set', () => {
      renderSchemaInput({ error: 'Schema must be a z.object({…}).' })
      expect(screen.getByRole('alert')).toHaveTextContent('Schema must be a z.object({…}).')
    })

    it('does not show error when error is null', () => {
      renderSchemaInput({ error: null })
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onChange when user types', async () => {
      const user = userEvent.setup()
      const { onChange } = renderSchemaInput()
      const textarea = screen.getByRole('textbox', { name: /zod schema input/i })
      await user.type(textarea, 'z')
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onVisualize when Visualize button is clicked', async () => {
      const user = userEvent.setup()
      const { onVisualize } = renderSchemaInput({ value: 'z.object({})' })
      await user.click(screen.getByRole('button', { name: /visualize/i }))
      expect(onVisualize).toHaveBeenCalledOnce()
    })

    it('calls onPresetSelect with the preset schema when a chip is clicked', async () => {
      const user = userEvent.setup()
      const { onPresetSelect } = renderSchemaInput()
      const firstPreset = PRESETS[0]
      await user.click(screen.getByRole('button', { name: firstPreset.label }))
      expect(onPresetSelect).toHaveBeenCalledWith(firstPreset.schema)
    })
  })
})
