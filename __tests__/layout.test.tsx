import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';

describe('Layout Component', () => {
  it('renders children within the layout', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('includes Header and Footer components', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    // Check for header branding
    expect(screen.getByText('Iqrah - Urdu TTS')).toBeInTheDocument();
    
    // Check for footer credits
    expect(screen.getByText('Created by')).toBeInTheDocument();
    expect(screen.getByText('Mohid Mughal')).toBeInTheDocument();
    expect(screen.getByText('Ahmed Javed')).toBeInTheDocument();
  });
});

describe('Header Component', () => {
  it('renders the branding text', () => {
    render(<Header />);
    
    expect(screen.getByText('Iqrah - Urdu TTS')).toBeInTheDocument();
    expect(screen.getByText('اردو ٹیکسٹ ٹو اسپیچ')).toBeInTheDocument();
  });

  it('applies Pakistan green background color', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    
    expect(header).toHaveClass('bg-pakistan-green');
  });
});

describe('Footer Component', () => {
  it('renders creator credits with correct links', () => {
    render(<Footer />);
    
    // Check that both creators are listed
    expect(screen.getByText('Mohid Mughal')).toBeInTheDocument();
    expect(screen.getByText('Ahmed Javed')).toBeInTheDocument();
    
    // Check all links
    const linkedInLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedInLinks).toHaveLength(2);
    expect(linkedInLinks[0]).toHaveAttribute('href', 'https://linkedin.com/in/mohidmughal');
    expect(linkedInLinks[1]).toHaveAttribute('href', 'https://www.linkedin.com/in/ahmed-javed');
    
    const githubLinks = screen.getAllByRole('link', { name: /GitHub/i });
    expect(githubLinks).toHaveLength(2);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/mohid-mughal');
    expect(githubLinks[1]).toHaveAttribute('href', 'https://github.com/vitiligo610');
  });

  it('displays NUST affiliation', () => {
    render(<Footer />);
    
    expect(screen.getByText('National University of Science and Technology')).toBeInTheDocument();
  });

  it('displays current year in copyright', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('applies Pakistan green background color', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toHaveClass('bg-pakistan-green');
  });
});
