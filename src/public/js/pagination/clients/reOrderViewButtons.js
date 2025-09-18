function reOrderViewButtons(){
   const indexInVet = vet.indexOf(selected);
    
    if (indexInVet === -1) {
        console.log("Elemento selecionado não encontrado no vet");
        return;
    }
    
    const indexInSubVet = subVet.indexOf(selected);
    
    // CASO 1: selected é o último elemento de subVet
    if (indexInSubVet === subVet.length - 1) {
        // Verificar se há elementos suficientes após o selected
        if (indexInVet + 4 < vet.length) {
            subVet = vet.slice(indexInVet - 4, indexInVet + 1);
        } else {
            // Se não houver elementos suficientes, pegar os últimos 5 elementos
            subVet = vet.slice(-5);
        }
    }
    // CASO 2: selected é o primeiro elemento de subVet
    else if (indexInSubVet === 0) {
        // CASO 2A: selected é o primeiro elemento do vet (valor 1)
        if (selected === vet[0]) {
            // Manter os próximos 4 elementos
            subVet = vet.slice(0, 5);
        }
        // CASO 2B: selected é primeiro de subvet mas não é 1
        else {
            // Fazer selected ser o último elemento e pegar os 4 anteriores
            const startIndex = Math.max(0, indexInVet - 4);
            subVet = vet.slice(startIndex, startIndex + 5);
        }
    }
    // CASO 3: selected não está no subVet atual ou está no meio
    else {
        // Reposicionar o subVet para ter o selected visível
        // Tenta centralizar o selected quando possível
        let startIndex = Math.max(0, indexInVet - 2);
        let endIndex = Math.min(vet.length, startIndex + 5);
        
        // Ajustar se não conseguir pegar 5 elementos
        if (endIndex - startIndex < 5) {
            startIndex = Math.max(0, endIndex - 5);
        }
        
        subVet = vet.slice(startIndex, endIndex);
    }
    
    console.log(`Selected: ${selected}, subVet: [${subVet}]`);
}