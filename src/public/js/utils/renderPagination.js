function renderPagination(sect, table){
  api.getInforTableRequest("clients")
  api.getInforTableResponse((_, data)=>{
    console.log(data)
    const btnVet = []
    const subVetControll = []

    for(let i = 1; i <= 23; i++){
      const btn = document.createElement("button")
      btn.className = " btn-genereted pagination-btn w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
      btn.textContent = i
      btn.value = i

      btnVet.push(btn)
    }
    if(subVetControll.length !== 4){
        for(let i = 1; i <= 4; i++){
        subVetControll.push(btnVet[i-1])
      }
    }
    console.log(sect)
    subVetControll.forEach(b => sect.appendChild(b))
    })
}