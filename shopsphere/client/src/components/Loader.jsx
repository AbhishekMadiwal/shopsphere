import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="d-flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            style={{
              width: dotSize, height: dotSize, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C8A97E, #B8956A)',
            }}
          />
        ))}
      </div>
      {text && <p className="mt-3" style={{ color: '#999', fontSize: '0.85rem', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export const InlineLoader = () => (
  <div className="d-flex justify-content-center align-items-center p-3">
    <div className="d-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#C8A97E',
          }}
        />
      ))}
    </div>
  </div>
);

/* Skeleton Card for product grid shimmer */
export const SkeletonCard = () => (
  <div className="card border-0" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)' }}>
    <div className="skeleton" style={{ height: 220 }} />
    <div className="p-3">
      <div className="skeleton skeleton-text" style={{ width: '40%', height: 10, marginBottom: 8 }} />
      <div className="skeleton skeleton-text" style={{ width: '90%', height: 14, marginBottom: 6 }} />
      <div className="skeleton skeleton-text" style={{ width: '60%', height: 14, marginBottom: 12 }} />
      <div className="skeleton skeleton-text" style={{ width: '35%', height: 12, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 38, borderRadius: 10 }} />
    </div>
  </div>
);

/* Skeleton Line for text shimmer */
export const SkeletonLine = ({ width = '100%', height = 14, style = {} }) => (
  <div className="skeleton" style={{ width, height, borderRadius: 6, ...style }} />
);

export default Loader;
