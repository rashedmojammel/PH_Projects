document.getElementById("addMoney-btn").addEventListener("click",function(){

    // const inputaddmoney = document.getElementById("cashout-input");
    // const number = inputaddmoney.value;
    const Bank = getValueInput("addMoney-bank");
    if( Bank == "Select Bank")
    {
        alert("Please Select a Bank");
        return;
    }


    const inputaddmoney = getValueInput("addMoney-input");
    
    // const inputAddmoneyAmount = document.getElementById("cashout-amount");
    // const amount = inputAddmoneyAmount.value;

    const inputAddmoneyAmount = getValueInput("addMoney-amount");



    const balanceElement = document.getElementById("balance");
    const balance = balanceElement.innerText;
     const newBalance = Number(balance) + Number(inputAddmoneyAmount);
    //return Number(newBalance);
   
    if(newBalance<0)
    {
        console.log("Invalid amount");
        return;
    }
    const inputaddmoneypin = document.getElementById("cashout-pin");
    const pin = inputaddmoneypin.value;
    console.log(pin);

    if(inputaddmoney == "01890642735" && pin == "6427")
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