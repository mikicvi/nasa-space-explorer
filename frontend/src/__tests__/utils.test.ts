import { cn } from '../lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('handles undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('merges tailwind classes correctly', () => {
      // Test that conflicting classes are properly merged
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('works with complex class combinations', () => {
      const result = cn(
        'px-2 py-1',
        'text-sm',
        true && 'bg-blue-500',
        false && 'bg-red-500',
        'hover:bg-blue-600'
      )
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
      expect(result).toContain('text-sm')
      expect(result).toContain('bg-blue-500')
      expect(result).toContain('hover:bg-blue-600')
      expect(result).not.toContain('bg-red-500')
    })
  })
})
