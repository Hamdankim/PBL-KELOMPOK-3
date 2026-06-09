/**
 * Test File: Header.test.tsx
 * 
 * File ini menguji komponen Header
 * Fokus: Component rendering dan basic interactions
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import Header from '../Header'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />
  },
}))

describe('Header Component', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider session={null}>{children}</SessionProvider>
  )

  const headerProps = {
    theme: 'light' as const,
    onToggleTheme: () => {},
    isOnline: true,
  }

  // Test 1: Component renders without crashing
  it('should render Header component without crashing', () => {
    render(<Header {...headerProps} />, { wrapper: Wrapper })

    const headerElement = screen.getByRole('banner')
    expect(headerElement).toBeInTheDocument()
  })

  // Test 2: Check if header has main content area
  it('should contain header content area', () => {
    render(<Header {...headerProps} />, { wrapper: Wrapper })

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toBeVisible()
  })

  // Test 3: Check if header is accessible
  it('should have proper semantic structure', () => {
    const { container } = render(<Header {...headerProps} />, { wrapper: Wrapper })

    const headerTag = container.querySelector('header')
    expect(headerTag).toBeInTheDocument()
  })
})
