import { Rating } from '@mui/material';

const RatingStars = ({ value, onChange, readOnly = false, size = 'medium' }) => {
  return (
    <Rating
      value={value || 0}
      onChange={onChange ? (_, newValue) => onChange(newValue) : undefined}
      readOnly={readOnly}
      size={size}
      precision={1}
    />
  );
};

export default RatingStars;
