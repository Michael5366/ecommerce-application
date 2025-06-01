import { ReactElement } from 'react';
import { Box, Fade, Modal } from '@mui/material';
import { sliderStyles } from './slider-styles';

interface ModalDetailProps {
  children: ReactElement;
  open: boolean;
  handler: () => void;
}

export const ModalDetail = ({ children, open, handler }: ModalDetailProps) => {
  const css = sliderStyles();

  return (
    <Modal open={open} onClose={handler} closeAfterTransition>
      <Fade in={open}>
        <Box className={css.modal__wrapper} data-testid="modal-wrapper" component="div">
          <button className={css['slider__close-btn']} onClick={handler}>
            &times;
          </button>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};
