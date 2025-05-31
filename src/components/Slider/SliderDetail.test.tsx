import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SliderDetail } from './Slider';

describe('SliderDetail', () => {
  it('renders a single image without slider when only one image is provided', () => {
    const props = {
      id: 'test-id',
      name: { en: 'One', ru: 'Один' },
      images: [{ url: 'https://example.com/image1.jpg' }],
    };

    render(<SliderDetail {...props} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
  });

  it('renders a slider with all images when more than one image is provided', () => {
    const props = {
      id: 'test-id',
      name: { en: 'Multi', ru: 'Много' },
      images: [
        { url: 'https://example.com/image1.jpg' },
        { url: 'https://example.com/image2.jpg' },
      ],
    };

    render(<SliderDetail {...props} />);

    const allImages = screen.getAllByRole('img', { hidden: true });

    const expectedSources = props.images.map((img) => img.url);
    const matchedImages = allImages.filter((img) => {
      const src = img.getAttribute('src') || '';
      return expectedSources.includes(src);
    });

    const uniqueSrcs = Array.from(new Set(matchedImages.map((img) => img.getAttribute('src'))));

    expect(uniqueSrcs).toHaveLength(props.images.length);
  });
});
