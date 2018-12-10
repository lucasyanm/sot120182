function processInfo(nodes){
    // Reinicia intervalo
    iter = 1
    cancelSimulation()
    cleanTable()

    // Getting data
    quantum = document.getElementById("inputquantum").value
    overload = document.getElementById("inputsobrecarga").value
    algorithm = document.querySelector('input[name="alg"]:checked').value
    memoryType = document.querySelector('input[name="mem"]:checked').value
    iotime = document.getElementById("inputiotime").value
    npages = document.getElementById("inputoagesperprocess").value

    // Allocating processes
    processesLines = info.split("\n")
    processes = []
    for(var i in processesLines){
        aux = processesLines[i].split(" ")
        processes.push({
            idNome:parseInt(),
            id:parseInt(i)+1,
            arriveTime:parseInt(aux[0]), 
            execTime:parseInt(aux[1]), 
            deadline:parseInt(aux[2]), 
            priority:parseInt(aux[3]),
            totalTime:0,
            inIO:false,
            exists:false
        });
    }   

    // Allocating processes
    for(var i in nodes){
        processes.push({
            idNome:parseInt(nodes[i]),
            id:parseInt(i)+1,
            arriveTime:getElementById("inputtime"+idNome), 
            execTime:getElementById("inputexecute"+idNome), 
            deadline:getElementById("inputdeadline"+idNome), 
            priority:getElementById("inputpriority"+idNome),
            totalTime:0,
            inIO:false,
            exists:false
        });
    }

    // Criando memoria
    if(memoryType == "FIFO"){
        memory = new MemoryFIFO(npages, processes.length)
    }
    if(memoryType == "MRU"){
        memory = new MemoryMRU(npages, processes.length)
    }

    // Criando a simulação
    if(algorithm == "FIFO"){
        simulacao = new SimulationFIFO(processes, memory, iotime, quantum, overload)
    }
    if(algorithm == "SJF"){
        simulacao = new SimulationSJF(processes, memory, iotime, quantum, overload)
    }
    if(algorithm == "ROUND"){
        simulacao = new SimulationROUND(processes, memory, iotime, quantum, overload)
    }
    if(algorithm == "EDF"){
        simulacao = new SimulationEDF(processes, memory, iotime, quantum, overload)
    }

    // Simulando
    finalTable = simulacao.simulate()
    return finalTable;


    // // Imprime tabela
    // tabelaAnterior = document.getElementById("tabela")
    // if(tabelaAnterior != null){
    //     document.getElementsByTagName("body")[0].removeChild(tabelaAnterior)
    // }    
    // tabela = document.createElement("table")
    // tabela.setAttribute("id", "tabela")
    
    // // First row (header)
    // firstRow = document.createElement("tr")
    // for(var i = 0; i < finalTable.length+1; i++){
    //     cell = document.createElement("th")
    //     cell.setAttribute("class", "processCell")
    //     cell.innerHTML = parseInt(i);
    //     firstRow.appendChild(cell)
    // }
    // tabela.appendChild(firstRow)

    // // Other columns and rows
    // for(var j = 0; j < processes.length; j++){
    //     row = document.createElement("tr")
    //     cell = document.createElement("td")
    //     cell.setAttribute("class", "processCell")
    //     cell.innerHTML = "P"+((parseInt(j)+1));
    //     row.appendChild(cell)
    //     for(var i = 0; i < finalTable.length; i++){
    //         cell = document.createElement("td")
    //         a = finalTable[i][j];
    //         if(a == "E"){
    //             cell.setAttribute("class", "execCell");
    //         }                
    //         if(a == "X"){
    //             cell.setAttribute("class", "prepCell");
    //         }                
    //         if(a == "-"){
    //             cell.setAttribute("class", "waitCell");
    //         }                
    //         if(a == "L"){
    //             cell.setAttribute("class", "lateCell");
    //         }
    //         if(a == "D"){
    //             cell.setAttribute("class", "ioCell");
    //         }                
    //         if(a == " "){
    //             cell.setAttribute("class", "blnkCell");
    //         }                
    //         row.appendChild(cell);
    //     }
    //     tabela.appendChild(row)
    // }      
    // document.getElementsByTagName("body")[0].appendChild(tabela)    
    // rows = document.getElementById("tabela").childNodes

    // update  = function()
    // {   
    //     if(iter >= finalTable.length){
    //         clearInterval(intervalExecution)
    //     }
    //     for(var i = 1; i < rows.length; i++){
    //         cell = rows[i].childNodes[iter]
    //         cellClass = cell.getAttribute("class");
    //         if (cellClass == "execCell"){
    //             color = "lightgreen";
    //         } 
    //         if (cellClass == "prepCell"){
    //             color = "red";
    //         } 
    //         if (cellClass == "waitCell"){
    //             color = "yellow";          
    //         } 
    //         if (cellClass == "lateCell"){
    //             color = "lightgray";
    //         }
    //         if (cellClass == "ioCell"){
    //             color = "darkgray";
    //         }
    //         if (cellClass == "blnkCell"){
    //             color = "white";
    //         }             
    //         cell.style.backgroundColor = color;
    //     }
    //     iter = iter + 1      
    // }
    // intervalExecution = setInterval(update, interval)

    // // Imprime turnaround
    // sum = 0
    // for(var i in processes){
    //     sum = sum + processes[i].totalTime
    // }
    // turnaraound = sum/processes.length
    
    // textAnterior = document.getElementById("turnaround")
    // if(textAnterior != null){
    //     document.getElementsByTagName("body")[0].removeChild(textAnterior)
    // }  
    // text = document.createElement("p")
    // text.setAttribute("id", "turnaround")
    // text.innerHTML = "Turnaround Médio = "+turnaraound
    // document.getElementsByTagName("body")[0].appendChild(text)   
    
}

