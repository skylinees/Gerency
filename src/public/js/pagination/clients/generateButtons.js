function generateButtons(pages){
  let allButtons = []
    for(let i = 1; i <= pages; i++){
      const btn = document.createElement("button")
      btn.className = " btn-genereted pagination-btn w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
      btn.textContent = i
      btn.value = i

      allButtons.push(btn)
      if(btn.value <= 5) buttonsToView.push(btn)
    }
  return allButtons
}