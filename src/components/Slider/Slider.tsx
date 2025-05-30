import { settings } from './slider-settings';
import { useState } from 'react';
import { Box, Fade, Modal } from '@mui/material';
import { sliderStyles } from './slider-styles';
import { SliderDetailProps } from '../../types/slider';
import Slider from 'react-slick';

export const SliderDetail = ({ id, name, images }: SliderDetailProps) => {
  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const [open, setOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const css = sliderStyles();

  const handleOpenModal = (index: number): void => {
    setActiveSlide(index);
    setOpen(true);
  };

  const handleCloseModal = (): void => {
    setOpen(false);
  };

  if (images.length === 1) {
    return (
      <Box component="div">
        <img
          className={css.slider__img}
          src={images[0].url}
          alt={name.en || name.ru}
          onClick={() => handleOpenModal(0)}
        />

        <Modal open={open} onClose={handleCloseModal} closeAfterTransition>
          <Fade in={open}>
            <Box className={css.modal__wrapper} component="div">
              <button className={css['slider__close-btn']} onClick={handleCloseModal}>
                &times;
              </button>
              <img className={css.slider__img} src={images[0].url} alt={name.en || name.ru} />
            </Box>
          </Fade>
        </Modal>
      </Box>
    );
  }

  return (
    <>
      <Slider
        className={css.slider}
        {...settings}
        asNavFor={nav2 ?? undefined}
        ref={(slider1) => setNav1(slider1)}
      >
        {images.map((img, index) => (
          <Box key={id + '-' + index}>
            <img
              onClick={() => handleOpenModal(index)}
              className={css.slider__img}
              src={img.url}
              alt={name.en || name.ru}
            />
          </Box>
        ))}
      </Slider>

      <Modal open={open} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={open}>
          <Box className={css.modal__wrapper} component={'div'}>
            <button className={css['slider__close-btn']} onClick={handleCloseModal}>
              &times;
            </button>
            <Slider
              key={activeSlide}
              {...settings}
              asNavFor={nav1 ?? undefined}
              ref={(slider2): void => setNav2(slider2)}
              swipeToSlide={true}
              focusOnSelect={true}
              initialSlide={activeSlide}
            >
              {images.map((img, index) => (
                <Box key={index}>
                  <img
                    className={css.slider__img}
                    src={img.url}
                    alt={name.en || name.ru || 'Image'}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};
