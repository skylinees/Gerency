function reOrderViewButtons(selected) {
    const indexInallButtonsClients = allButtonsClients.indexOf(selected);
    
    if (indexInallButtonsClients === -1) {
        console.log("Elemento selecionado não encontrado no allButtonsClients");
        return;
    }
    
    const indexInbuttonsToView = buttonsToView.indexOf(selected);
    
    if (indexInbuttonsToView === buttonsToView.length - 1) {
        if (indexInallButtonsClients + 4 < allButtonsClients.length) {
            buttonsToView = allButtonsClients.slice(indexInallButtonsClients, indexInallButtonsClients + 5);
        } else {
            buttonsToView = allButtonsClients.slice(-5);
        }
    }
    else if (indexInbuttonsToView === 0) {
        if (indexInallButtonsClients - 4 >= 0) {
            buttonsToView = allButtonsClients.slice(indexInallButtonsClients - 4, indexInallButtonsClients + 1);
        } else {
            buttonsToView = allButtonsClients.slice(0, 5);
        }
    }
    else {
        let startIndex = Math.max(0, indexInallButtonsClients - 2);
        let endIndex = Math.min(allButtonsClients.length, startIndex + 5);
        
        if (endIndex - startIndex < 5) {
            startIndex = Math.max(0, endIndex - 5);
        }
        
        buttonsToView = allButtonsClients.slice(startIndex, endIndex);
    }
    
    console.log(`Selected: ${selected}, buttonsToView: [${buttonsToView}]`);
}