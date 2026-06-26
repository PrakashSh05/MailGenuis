import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordStrengthMeter from '../components/features/profile/PasswordStrengthMeter';

describe('PasswordStrengthMeter', () => {
  it('renders nothing when password is empty', () => {
    const { container } = render(<PasswordStrengthMeter password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when password is null', () => {
    const { container } = render(<PasswordStrengthMeter password={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows "Weak" for a simple lowercase password', () => {
    render(<PasswordStrengthMeter password="abcdefg" />);
    expect(screen.getByText('Weak')).toBeInTheDocument();
  });

  it('shows "Fair" for a password with uppercase and length > 8', () => {
    render(<PasswordStrengthMeter password="Abcdefghi" />);
    expect(screen.getByText('Fair')).toBeInTheDocument();
  });

  it('shows "Good" for a password with uppercase, numbers, and length > 8', () => {
    render(<PasswordStrengthMeter password="Abcdefg1" />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows "Strong" for a password with uppercase, numbers, specials, and length > 8', () => {
    render(<PasswordStrengthMeter password="Abcdefg1!" />);
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('displays the strength label text', () => {
    render(<PasswordStrengthMeter password="test" />);
    expect(screen.getByText('Password strength')).toBeInTheDocument();
  });
});
