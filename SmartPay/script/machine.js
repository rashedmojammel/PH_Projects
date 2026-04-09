function showonly(id){

    const addmoney = document.getElementById("addMoney");
    const cashout = document.getElementById("cashout");
    const TransferMoney = document.getElementById("TransferMoney");
    const BonusCupon = document.getElementById("BonusCupon");
    const Paybill = document.getElementById("Paybill");
    const Transaction = document.getElementById("Transaction");
    addmoney.classList.add("hidden");
    cashout.classList.add("hidden");
    TransferMoney.classList.add("hidden");
    BonusCupon.classList.add("hidden");
    Paybill.classList.add("hidden");
    Transaction.classList.add("hidden");

    const selected = document.getElementById(id);
    selected.classList.remove("hidden");
}


function getValueInput(id)
{
    const inputValue = document.getElementById(id);
    const input = inputValue.value;
    console.log(input);
    return input;

}