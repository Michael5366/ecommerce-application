declare module 'toastify-js' {
  interface ToastifyOptions {
    text: string;
    duration?: number;
    selector?: string;
    destination?: string;
    newWindow?: boolean;
    close?: boolean;
    gravity?: 'top' | 'bottom';
    position?: 'left' | 'center' | 'right';
    stopOnFocus?: boolean;
    onClick?: () => void;
    offset?: {
      x?: number | string;
      y?: number | string;
    };
    escapeMarkup?: boolean;
    style?: Partial<CSSStyleDeclaration>;
    className?: string;
    avatar?: string;
  }

  interface ToastifyObject {
    showToast: () => void;
  }

  function Toastify(options: ToastifyOptions): ToastifyObject;

  export = Toastify;
}
