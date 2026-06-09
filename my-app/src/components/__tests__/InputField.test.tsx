/**
 * Test File: InputField.test.tsx
 * 
 * File ini menguji komponen InputField
 * Fokus: User interactions, input handling, event handlers
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputField from '../InputField'

describe('InputField Component', () => {
  
  // Test 1: Component renders
  it('should render InputField component', () => {
    // Arrange & Act
    render(<InputField name="email" label="Email" />)
    
    // Assert
    const input = screen.getByLabelText(/Email/i)
    expect(input).toBeInTheDocument()
  })

  // Test 2: Label text displays correctly
  it('should display label text', () => {
    // Arrange & Act
    render(<InputField name="username" label="Username" />)
    
    // Assert
    const label = screen.getByText('Username')
    expect(label).toBeInTheDocument()
  })

  // Test 3: User can type into input
  it('should accept user text input', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<InputField name="email" label="Email" />)
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement
    
    // Act: User types email
    await user.type(input, 'test@example.com')
    
    // Assert: Verify input value changed
    expect(input.value).toBe('test@example.com')
  })

  // Test 4: Input focuses and blurs correctly
  it('should handle focus and blur events', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<InputField name="email" label="Email" />)
    const input = screen.getByLabelText(/Email/i)
    
    // Act & Assert: Click to focus
    await user.click(input)
    expect(input).toHaveFocus()
    
    // Act & Assert: Tab to blur
    await user.tab()
    expect(input).not.toHaveFocus()
  })

  // Test 5: Input field accepts numbers
  it('should accept numeric input', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<InputField name="phone" label="Phone" type="tel" />)
    const input = screen.getByLabelText(/Phone/i) as HTMLInputElement
    
    // Act
    await user.type(input, '081234567890')
    
    // Assert
    expect(input.value).toBe('081234567890')
  })

  // Test 6: Input can be cleared
  it('should allow clearing input value', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<InputField name="email" label="Email" />)
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement
    
    // Act: Type value
    await user.type(input, 'test@example.com')
    expect(input.value).toBe('test@example.com')
    
    // Act: Clear value (select all then delete)
    await user.tripleClick(input)
    await user.keyboard('{Delete}')
    
    // Assert
    expect(input.value).toBe('')
  })

  // Test 7: Input placeholder works
  it('should display placeholder text', () => {
    // Arrange & Act
    render(
      <InputField 
        name="search" 
        label="Search" 
        placeholder="Search here..."
      />
    )
    
    // Assert
    const input = screen.getByPlaceholderText('Search here...')
    expect(input).toBeInTheDocument()
  })

  // Test 8: Input is disabled when specified
  it('should be disabled when disabled prop is true', () => {
    // Arrange & Act
    render(
      <InputField 
        name="email" 
        label="Email" 
        disabled={true}
      />
    )
    
    // Assert
    const input = screen.getByLabelText(/Email/i) as HTMLInputElement
    expect(input).toBeDisabled()
  })
})
