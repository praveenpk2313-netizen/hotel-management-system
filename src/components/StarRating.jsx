import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onChange, max = 5, size = 18, readOnly = false }) => {
  const [hover, setHover] = React.useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hover || rating);

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHover(starValue)}
            onMouseLeave={() => !readOnly && setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: readOnly ? 'default' : 'pointer',
              color: isFilled ? '#f59e0b' : '#e2e8f0',
              transition: 'transform 0.1s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={e => !readOnly && (e.currentTarget.style.transform = 'scale(0.9)')}
            onMouseUp={e => !readOnly && (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Star 
              size={size} 
              fill={isFilled ? 'currentColor' : 'none'} 
              strokeWidth={isFilled ? 0 : 2}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
