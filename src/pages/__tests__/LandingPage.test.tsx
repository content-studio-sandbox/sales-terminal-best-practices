import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import LandingPage from '../LandingPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main title', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Your Projects @ IBM/i)).toBeInTheDocument();
  });

  it('should render the logo', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const logo = screen.getByAltText('YP logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://i.imgur.com/Yhv1umJ.png');
  });

  it('should render the lead description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Connect with real projects that match your skills/i)).toBeInTheDocument();
  });

  it('should render audience tags', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/For interns & new hires/i)).toBeInTheDocument();
    expect(screen.getByText(/For project owners & leaders/i)).toBeInTheDocument();
  });

  it('should render Explore Projects button', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const exploreButton = screen.getByRole('button', { name: /Explore Projects/i });
    expect(exploreButton).toBeInTheDocument();
  });

  it('should navigate to /ambitions when Explore Projects is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const exploreButton = screen.getByRole('button', { name: /Explore Projects/i });
    await user.click(exploreButton);

    expect(mockNavigate).toHaveBeenCalledWith('/ambitions');
  });

  it('should render Update Profile button', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const profileButton = screen.getByRole('button', { name: /Update My Profile/i });
    expect(profileButton).toBeInTheDocument();
  });

  it('should navigate to /your-projects when Update Profile is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const profileButton = screen.getByRole('button', { name: /Update My Profile/i });
    await user.click(profileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/your-projects');
  });

  it('should render three feature cards', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Business Leaders')).toBeInTheDocument();
    expect(screen.getByText('YourProjects Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
  });

  it('should render Business Leaders card description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Post projects where you need help/i)).toBeInTheDocument();
  });

  it('should render Marketplace card description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/We match you with projects that fit your skills/i)).toBeInTheDocument();
  });

  it('should render Employees card description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Share your skills, interests, and availability/i)).toBeInTheDocument();
  });

  it('should render "How it works" section title', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText('How it works')).toBeInTheDocument();
  });

  it('should render all three "How it works" steps', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Build your profile')).toBeInTheDocument();
    expect(screen.getByText('Explore career paths')).toBeInTheDocument();
    expect(screen.getByText('Join and contribute')).toBeInTheDocument();
  });

  it('should render step 1 description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Tell us about your skills, interests, and when you're available/i)).toBeInTheDocument();
  });

  it('should render step 2 description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Browse career paths to find projects organized by area/i)).toBeInTheDocument();
  });

  it('should render step 3 description', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Apply to projects that interest you, do meaningful work/i)).toBeInTheDocument();
  });

  it('should navigate to /your-projects when "Open profile" button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const openProfileButton = screen.getByRole('button', { name: /Open profile/i });
    await user.click(openProfileButton);

    expect(mockNavigate).toHaveBeenCalledWith('/your-projects');
  });

  it('should navigate to /ambitions when "View career paths" button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const viewPathsButton = screen.getByRole('button', { name: /View career paths/i });
    await user.click(viewPathsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/ambitions');
  });

  it('should navigate to /ambitions when "Find projects" button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const findProjectsButton = screen.getByRole('button', { name: /Find projects/i });
    await user.click(findProjectsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/ambitions');
  });

  it('should render step numbers', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    const stepNumbers = screen.getAllByText(/^[123]$/);
    expect(stepNumbers).toHaveLength(3);
  });
});

// Made with Bob