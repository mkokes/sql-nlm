import { cn } from './utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    // Test with simple strings
    expect(cn('class1', 'class2')).toBe('class1 class2')
    
    // Test with conditional classes
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
    
    // Test with undefined values
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    
    // Test with null values
    expect(cn('class1', null, 'class2')).toBe('class1 class2')
    
    // Test with empty strings
    expect(cn('class1', '', 'class2')).toBe('class1 class2')
    
    // Test with tailwind classes that need merging
    expect(cn('p-4 bg-red-500', 'p-6')).toBe('bg-red-500 p-6')
    
    // Test with complex tailwind classes
    expect(cn(
      'text-gray-500 dark:text-gray-400',
      'bg-white dark:bg-gray-800',
      'hover:text-gray-700 dark:hover:text-gray-300'
    )).toBe('text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300')
  })
})
