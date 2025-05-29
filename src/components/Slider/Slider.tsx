import { settings } from './slider-settings';
// import { useState } from 'react';
import { Box } from '@mui/material';
import { sliderStyles } from './slider-styles';
import Slider from 'react-slick';

interface ImageItem {
  url: string;
}

interface SliderDetailProps {
  id: string;
  name: {
    en?: string;
    ru?: string;
  };
  images: ImageItem[];
}

export const SliderDetail = ({ id, name, images }: SliderDetailProps) => {
  // const [nav1, setNav1] = useState<Slider | null>(null);
  // const [nav2, setNav2] = useState<Slider | null>(null);

  const css = sliderStyles();

  if (images.length === 1) {
    return (
      <Box component="div">
        <img className={css.slider__img} src={images[0].url} alt={name.en || name.ru} />
      </Box>
    );
  }

  return (
    <>
      <Slider
        className={css.slider}
        {...settings}
        // asNavFor={nav2 ?? undefined}
        // ref={(slider1) => setNav1(slider1)}
      >
        {images.map((img, index) => (
          <Box key={id + '-' + index}>
            <img
              onClick={() => console.log(1)}
              key={id + '-' + index}
              className={css.slider__img}
              src={img.url}
              alt={name.en || name.ru}
            />
          </Box>
        ))}
      </Slider>
    </>
  );
};
