import FoodCard from '@/Components/FoodCard';
import React from 'react';

const Foodpage = async () => {

    const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/foods');
    const foods = await res.json();
    const data = foods.data;
    console.log(foods);

    return (
        <div>

            <h2>Foods : {data.length}</h2>
            <div className='grid grid-cols-3 gap-5'>
                {
                foods.data.map(food => <FoodCard key={food.id} food={food}>

                </FoodCard>)
            }

            </div>

            

            
        </div>
    );
};

export default Foodpage;