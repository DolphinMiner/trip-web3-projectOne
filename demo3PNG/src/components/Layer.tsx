import Image from 'next/image';
import React from 'react';
import styles from './Layer.module.css';

const Layer = ({ src, alt }) => (
  <div className={styles.layerContainer}>
    <Image 
      className={styles.layer} 
      src={src} 
      alt={alt}
    />
  </div>
);

export default Layer;
