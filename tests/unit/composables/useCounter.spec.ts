import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(10)
    expect(count.value).toBe(10)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })

  it('should decrement count', () => {
    const { count, decrement } = useCounter(5)
    decrement()
    expect(count.value).toBe(4)
  })

  it('should compute doubled value', () => {
    const { count, doubled } = useCounter(5)
    expect(doubled.value).toBe(10)
  })

  it('should reset count', () => {
    const { count, increment, reset } = useCounter(0)
    increment()
    increment()
    expect(count.value).toBe(2)
    reset()
    expect(count.value).toBe(0)
  })
})
