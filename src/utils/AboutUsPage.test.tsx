import { render, screen } from '@testing-library/react';
import AboutUsPage from '../pages/About-us-page/AboutUsPage';
import teamData from '../pages/About-us-page/team-data';
import { describe, expect, it } from 'vitest';

describe('AboutUsPage', () => {
  it('renders the main header', () => {
    render(<AboutUsPage />);
    expect(screen.getByRole('heading', { name: /about us/i })).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    render(<AboutUsPage />);
    expect(screen.getByText(/built with code, driven by teamwork/i)).toBeInTheDocument();
  });

  it('renders a card for each team member', () => {
    render(<AboutUsPage />);

    teamData.forEach((member) => {
      expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument();
      expect(
        screen.getByAltText(`Here is the photo of the team member ${member.name}`)
      ).toBeInTheDocument();
      expect(screen.getByText(member.position)).toBeInTheDocument();
      expect(screen.getByText(member.description)).toBeInTheDocument();
    });
  });

  it('renders a modal trigger for each team member', () => {
    render(<AboutUsPage />);
    const modalTriggers = screen.getAllByRole('button', { name: /read more/i });
    expect(modalTriggers).toHaveLength(teamData.length);
  });

  it('renders GitHub links with correct href, target and rel', () => {
    render(<AboutUsPage />);
    const githubLinks = screen.getAllByRole('link', { name: /github/i });

    teamData.forEach((member) => {
      const link = githubLinks.find((l) => l.getAttribute('href') === member.github);
      expect(link).toBeTruthy();
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
