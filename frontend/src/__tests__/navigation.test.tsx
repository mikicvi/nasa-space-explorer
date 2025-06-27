import { render, screen } from '@testing-library/react'
import { Navigation } from '../components/layout/navigation'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('Navigation Component', () => {
  it('renders navigation with correct links', () => {
    render(<Navigation />)
    
    // Check if main navigation items are present - just check they exist
    expect(screen.getByText('NASA Explorer')).toBeTruthy()
    expect(screen.getAllByText('Home')[0]).toBeTruthy() // Take first occurrence
    expect(screen.getAllByText('APOD')[0]).toBeTruthy() // Take first occurrence
    
    // Mars Rovers appears as "Mars" on medium screens and "Mars Rovers" on XL screens
    const marsText = screen.queryByText('Mars Rovers') || screen.queryByText('Mars')
    expect(marsText).toBeTruthy()
    
    // ISS Tracker appears as "ISS" on medium screens and "ISS Tracker" on XL screens
    const issText = screen.queryByText('ISS Tracker') || screen.queryByText('ISS')
    expect(issText).toBeTruthy()
    
    // NEO appears as "NEO" on medium screens and "Near Earth Objects" on XL screens
    const neoText = screen.queryByText('Near Earth Objects') || screen.queryByText('NEO')
    expect(neoText).toBeTruthy()
    
    // Gallery appears as "Gallery" on medium screens and "Image Gallery" on XL screens
    const galleryText = screen.queryByText('Image Gallery') || screen.queryByText('Gallery')
    expect(galleryText).toBeTruthy()
  })

  it('has correct href attributes for navigation links', () => {
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink.getAttribute('href')).toBe('/')
    
    const apodLink = screen.getByRole('link', { name: /apod/i })
    expect(apodLink.getAttribute('href')).toBe('/apod')
  })

  it('shows mobile menu toggle', () => {
    render(<Navigation />)
    
    // The mobile menu button should be present
    const mobileMenuButton = screen.getByRole('button')
    expect(mobileMenuButton).toBeTruthy()
  })
})
