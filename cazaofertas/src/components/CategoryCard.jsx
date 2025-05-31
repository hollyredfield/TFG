import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CategoryCard = ({ title, description, image, slug }) => {
  return (
    <Link to={`/categoria/${slug}`} className="block">
      <div
        className="category-card-modern"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="category-card-modern-content">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </div>
    </Link>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired
};

export default CategoryCard;