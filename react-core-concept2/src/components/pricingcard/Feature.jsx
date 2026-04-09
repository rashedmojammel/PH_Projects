import { CircleCheckBig } from 'lucide-react';
import React from 'react';

const feature = ({feature}) => {
    console.log(feature);
    return (
        <div className='flex mt-2'>
           <CircleCheckBig className='mr-2'></CircleCheckBig><p>{feature}</p>
            
        </div>
    );
};

export default feature;