
import { Suspense } from 'react';
import './App.css'
import NavBar from './NavBar';
import DisPricing from './Pricing/DisPricing';

const pricingPromise = fetch('gympricing.json')
.then(res => res.json());

function App() {
  

  return (
    <>
     
      <NavBar></NavBar>

      <main>
       <Suspense fallback={<span class="loading loading-spinner text-secondary"></span>}>
        <DisPricing pricingPromise = {pricingPromise}></DisPricing>
       </Suspense>
      </main>
      
      
      
    </>
  )
}

export default App;