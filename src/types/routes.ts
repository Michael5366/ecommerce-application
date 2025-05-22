import { ReactElement } from 'react';

export type Routes = {
  path: string;
  element: ReactElement;
  children: {
    index?: boolean;
    path?: string;
    element: ReactElement;
  }[];
}[];
