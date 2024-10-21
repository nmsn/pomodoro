'use client';
import { ReactNode } from 'react';
import cx from 'classnames';

import styles from './styles.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={cx(styles.background, 'w-full h-full')}>
      <div>{children}</div>;
    </div>
  );
}
