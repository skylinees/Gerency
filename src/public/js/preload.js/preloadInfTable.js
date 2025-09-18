let tableInfClients
api.getInforTableRequest("clients")
api.getInforTableResponse((_, data)=> {tableInfClients = data})