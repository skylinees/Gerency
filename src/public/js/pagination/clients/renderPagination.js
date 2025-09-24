let allButtonsClients = []
let buttonsToView = []
function renderPagination(selected){
  if(allButtonsClients.length == 0){
    allButtonsClients = generateButtons(tableInfClients.totalPages)
  }

  reOrderViewButtons(selected)
  sectClient.replaceChildren();
  buttonsToView.forEach(button => sectClient.appendChild(button))
}