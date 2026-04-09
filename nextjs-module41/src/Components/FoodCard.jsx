
import Image from 'next/image';
import React from 'react';

const FoodCard = ({food}) => {

    const{id, dish_name, category,image_link} = food;
    return (
      <div className="card bg-base-100 shadow-sm ">
       <Image
        src={food.image_link}
        alt={dish_name}
        width={400}
        height={400}
       />

  <div className="card-body">
    <h2 className="card-title">
      {dish_name}

      <div className="badge badge-secondary">NEW</div>
    </h2>
    <p>{category}</p>
    <div className="card-actions justify-end">
      <div className="badge badge-outline">Fashion</div>
      <div className="badge badge-outline">Products</div>
    </div>
  </div>
</div>
    );
};

export default FoodCard;