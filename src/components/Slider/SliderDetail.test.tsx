import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

    const allImages: HTMLElement[] = screen.getAllByRole('img', { hidden: true });

    const expectedSources: string[] = props.images.map((img) => img.url);
    const matchedImages: HTMLElement[] = allImages.filter((img) => {
      const src: string = img.getAttribute('src') || '';
      return expectedSources.includes(src);
    });

    const uniqueSrcs = Array.from(new Set(matchedImages.map((img) => img.getAttribute('src'))));

    expect(uniqueSrcs).toHaveLength(props.images.length);
  });

  it('opens modal with single image when only one image is provided', async () => {
    const props = {
      id: 'test-single',
      name: { en: 'Image', ru: 'Изображение' },
      images: [{ url: 'https://example.com/one.jpg' }],
    };

    render(<SliderDetail {...props} />);

    const image: HTMLElement = screen.getByAltText('Image');
    fireEvent.click(image);

    const modalWrapper: HTMLElement = await screen.findByTestId('modal-wrapper');

    const modalImages: HTMLElement[] = within(modalWrapper).getAllByRole('img');
    expect(modalImages).toHaveLength(1);

    expect(within(modalWrapper).queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    expect(
      within(modalWrapper).queryByRole('button', { name: /previous/i })
    ).not.toBeInTheDocument();
  });

  it('opens modal with slider when more than one image is provided', async () => {
    const props = {
      id: 'test-multiple',
      name: { en: 'Image', ru: 'Изображение' },
      images: [
        { url: 'https://example.com/image1.jpg' },
        { url: 'https://example.com/image2.jpg' },
      ],
    };

    render(<SliderDetail {...props} />);

    const images: HTMLElement[] = screen.getAllByAltText(/Image \d+/);
    await fireEvent.click(images[0]);

    const modalWrapper = await screen.findByTestId('modal-wrapper');

    await waitFor(() => {
      const modalImages: HTMLElement[] = within(modalWrapper).getAllByRole('img', { hidden: true });
      expect(modalImages.length).toBeGreaterThan(1);
    });
  });
});
