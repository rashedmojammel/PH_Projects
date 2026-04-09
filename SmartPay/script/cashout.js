document.getElementById("cashout-btn").addEventListener("click",function(){

    // const inputcashout = document.getElementById("cashout-input");
    // const number = inputcashout.value;

    const inputcashout = getValueInput("cashout-input");
    
    // const inputAmount = document.getElementById("cashout-amount");
    // const amount = inputAmount.value;

    const inputAmount = getValueInput("cashout-amount");



    const balanceElement = document.getElementById("balance");
    const balance = balanceElement.innerText;
     const newBalance = Number(balance) - Number(inputAmount);
    //return Number(newBalance);
   
    if(newBalance<0)
    {
        console.log("Invalid amount");
        return;
    }
    const inputcashoutpin = document.getElementById("cashout-pin");
    const pin = inputcashoutpin.value;
    console.log(pin);

    if(inputcashout == "01890642735" && pin == "6427")
    {
        alert("cashout succesfull");
        balanceElement.innerText = newBalance; 
    }
    else
    {
        alert("Cashout failed");
        return;
    }
})