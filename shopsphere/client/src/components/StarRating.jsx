import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, count = null, size = 'sm', interactive = false, onRate = null }) => {
  const stars = [1, 2, 3, 4, 5];
  const iconSize = size === 'lg' ? 22 : size === 'md' ? 18 : 14;

  return (
    <span className="d-inline-flex align-items-center gap-0">
      {stars.map((star) => (
        <span
          key={star}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.15s, color 0.15s',
            display: 'inline-flex',
            padding: '1px',
          }}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={(e) => interactive && (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => interactive && (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Star
            size={iconSize}
            fill={star <= Math.round(rating) ? '#C8A97E' : 'none'}
            color={star <= Math.round(rating) ? '#C8A97E' : '#ddd'}
            strokeWidth={star <= Math.round(rating) ? 0 : 1.5}
          />
        </span>
      ))}
      {count !== null && (
        <span style={{ fontSize: '0.75rem', color: '#999', marginLeft: '4px' }}>
          ({count})
        </span>
      )}
    </span>
  );
};

export default StarRating;
