import React from 'react';
import Feature from './Feature'


const PricingCard = ({pricing}) => {
     console.log(pricing);
    return (
       
        <div className='border border-2 rounded-2xl bg-amber-400'>
            <h1>Name : {pricing.name}</h1>
            <h3>Price : {pricing.price}</h3>
            <div>
                <h1>Fetures</h1>
                {
                    pricing.features.map(feature =><Feature feature={feature}></Feature>)
                }
            </div>
        </div>
    );
};

export default PricingCard;