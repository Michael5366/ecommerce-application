import { useState } from 'react';
import aboutPageStyles from './about-us-styles';
import { Fade, Modal } from '@mui/material';

type AboutModalProps = {
  text: string;
};

const AboutModal = ({ text }: AboutModalProps) => {
  const css = aboutPageStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <button className={css.content__btn} onClick={handleOpen}>
        Read more
      </button>

      <Modal className={css.content__modal} open={open} onClose={handleClose}>
        <Fade in={open}>
          <div className={css.content__biography}>
            <button className={css['content__close-btn']} onClick={handleClose}>
              &times;
            </button>
            {text}
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default AboutModal;
