import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { GameImage as GameImageType } from '../../types/game';

export function GameImage({ image, nextImage }: { image: GameImageType; nextImage?: GameImageType }) {
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  useEffect(() => { setLoaded(false); setBroken(false); }, [image.id]);
  useEffect(() => {
    if (!nextImage) return;
    const preload = new Image();
    preload.src = nextImage.src;
  }, [nextImage]);

  return (
    <motion.figure className="game-image" key={image.id} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.34 }}>
      {!loaded && !broken && <div className="image-placeholder" aria-label="Loading challenge image"><span /></div>}
      {broken ? (
        <div className="image-error" role="alert"><ImageOff size={36} /><strong>Image unavailable</strong><span>You can still continue this round.</span></div>
      ) : (
        <img src={image.src} alt={image.alt} onLoad={() => setLoaded(true)} onError={() => setBroken(true)} className={loaded ? 'is-loaded' : ''} />
      )}
      <span className="scan-line" aria-hidden="true" />
      <span className="frame-corner frame-corner--tl" aria-hidden="true" /><span className="frame-corner frame-corner--tr" aria-hidden="true" />
      <span className="frame-corner frame-corner--bl" aria-hidden="true" /><span className="frame-corner frame-corner--br" aria-hidden="true" />
    </motion.figure>
  );
}
