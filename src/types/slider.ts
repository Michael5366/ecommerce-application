interface ImageItem {
  url: string;
}

export interface SliderDetailProps {
  id: string;
  name: {
    en?: string;
    ru?: string;
  };
  images: ImageItem[];
}
