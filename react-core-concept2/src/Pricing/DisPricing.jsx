import React, { use } from 'react';
import PricingCard from '../components/pricingcard/PricingCard';

const DisPricing = ({pricingPromise}) =>{

    const priceData = use(pricingPromise);
    console.log(priceData);


    return (
        <div>
            <h2>Get our Membership</h2>
            <div>
                {
                    priceData.map(pricing => <PricingCard key={priceData.id} pricing={pricing}></PricingCard>)
                }
            </div>
        </div>
    );
};

export default DisPricing;