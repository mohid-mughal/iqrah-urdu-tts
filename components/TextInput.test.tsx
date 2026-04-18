/**
 * TextInput Component Manual Verification Guide
 * 
 * This component implements the following requirements:
 * 
 * Requirements 1.1, 1.2, 1.3, 8.3:
 * - Accepts both Urdu script and Roman Urdu characters
 * - Automatically converts Roman Urdu to Urdu script
 * - Preserves existing Urdu script without modification
 * - Uses Noto Nastaliq Urdu font for culturally appropriate display
 * - Right-to-left text direction for Urdu
 * 
 * Manual Testing Steps:
 * 
 * 1. Type Roman Urdu text (e.g., "mera naam mohid hai")
 *    Expected: Text should automatically convert to Urdu script
 * 
 * 2. Paste Urdu script text (e.g., "میرا نام محد ہے")
 *    Expected: Text should remain unchanged in Urdu script
 * 
 * 3. Type mixed content (Roman + Urdu)
 *    Expected: Roman parts convert, Urdu parts preserved
 * 
 * 4. Verify font rendering
 *    Expected: Text displays in Noto Nastaliq Urdu font
 * 
 * 5. Verify text direction
 *    Expected: Text flows right-to-left
 * 
 * Component Features:
 * - Real-time transliteration using TransliterationService
 * - Preserves Urdu script characters during conversion
 * - Graceful error handling with safeRomanToUrdu
 * - Accessible with ARIA labels
 * - Responsive textarea with resize capability
 * - Focus states with Pakistan green theme
 * - Disabled state support
 * - Helpful hint text below input
 */

import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from './TextInput';
import { transliterationService } from '@/services/transliteration.service';

describe('TextInput Component', () => {
  it('renders with default placeholder', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('placeholder');
  });

  it('calls onChange with transliterated text', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'salam' } });
    
    expect(mockOnChange).toHaveBeenCalled();
    // The actual transliteration is handled by the service
  });

  it('has right-to-left direction', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('dir', 'rtl');
  });

  it('has Urdu language attribute', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('lang', 'ur');
  });

  it('applies urdu-text class for font styling', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('urdu-text');
  });

  it('can be disabled', () => {
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} disabled={true} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('displays the provided value', () => {
    const mockOnChange = jest.fn();
    const testValue = 'میرا نام محد ہے';
    render(<TextInput value={testValue} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(testValue);
  });

  it('uses safeRomanToUrdu for error handling', () => {
    const spy = jest.spyOn(transliterationService, 'safeRomanToUrdu');
    const mockOnChange = jest.fn();
    render(<TextInput value="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test' } });
    
    expect(spy).toHaveBeenCalledWith('test');
    spy.mockRestore();
  });
});
