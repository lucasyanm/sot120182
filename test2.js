var intervalExecution;
var iter;
class NormalQueue{
    constructor(){
        this.arr = []
        this.length = 0
    }
    queue(a){
        this.arr.push(a)
        this.length++
    }
    dequeue(){
        if(this.arr.length > 0){
            this.length--
            return this.arr.shift()
        }
    }
}

class MemoryFIFO{
    constructor(){
        this.virtualMemory = Array(processes.length*npages).fill(null)
        this.realMemory = Array(50).fill(null)    
    }
    
}

class Simulation{
    constructor(processes, npages, memoryAlgorithm, iotime){
        this.processes = processes
        this.npages = npages
        this.memAlg = memoryAlgorithm
        this.iotime = iotime
        this.currentTime = 0
        this.count = processes.length
    }

    simulateTime(){}

    checkArrived(){
        for(var i in processes){
            if(processes[i].arriveTime == this.currentTime){
                processes[i].exists = true
                this.readyQueue.queue(processes[i])
            }
        }
    }

    incTotalTimeProcesses(){
        for(var i in processes){
            if(processes[i].exists){
                processes[i].totalTime++
            }
        }
    }

    createColumn(isPreemption, current){
        column = []
        for(var i in processes){
            if(current == processes[i]){
                if(isPreemption == true){
                    value = "X"
                }
                else if(processes[i].inIO){
                    value = "D"
                }
                else{
                    if(current.deadline < 0){
                        value = "L"
                    }
                    else{
                        value = "E"
                    }
                }                
            }
            else if (processes[i].exists == true){
                if(processes[i].inIO){
                    value = "D"
                }
                else{
                    value = "-"
                }
                
            }
            else{
                value = " "
            }
            column.push(value)
        }
        return column
    }

    simulate(){
        matrix = []
        while(true){
            x = this.simulateTime()
            if(x == null) break;
            matrix.push(x)
        }
        return matrix
    }
}

class SimulationFIFO extends Simulation{

    constructor(processes, npages, memoryAlgorithm, iotime){
        super(processes, npages, memoryAlgorithm, iotime)
        this.readyQueue = new NormalQueue()
        this.usedIOTime = iotime
        this.current = null
    }   

    simulateTime(){

        // Se não tem processo
        if(count <= 0) return null

        // Procura quem chegou
        this.checkArrived()
        this.incTotalTimeProcesses()

        // Determina o atual
        if(current == null && readyQueue.length != 0){
            current = readyQueue.dequeue()
            usedIOTime = iotime
        }

        // Executa ou pega io
        if(current != null){
            if(usedIOTime == 0){
                current.execTime--    
            }
            else{
                usedIOTime--
            }
            
        }

        // Cria coluna
        currentColumn = createColumn(false, current)

        // Se terminou a execução neste instante
        if(current != null && current.execTime == 0){
            current = null
            count--
        }

        // Finaliza
        currentTime++
        return currentColumn

    }

}

class SimulationROUND extends Simulation{
    constructor(processes, npages, memoryAlgorithm, iotime, quantum, overload){
        super(processes, npages, memoryAlgorithm, iotime)
        this.readyQueue = new NormalQueue()
        this.quantum = quantum
        this.overload = overload
    }
}

function getMaxExecTime(processes){
    maxExec = processes[0].execTime
    for(var i in processes){
        if(processes[i].execTime > maxExec){
            maxExec = processes[i].execTime
        }
    }
    return maxExec
}

function cancelSimulation(){
    clearInterval(intervalExecution)
}

function cleanTable(){
    clearInterval(intervalExecution)
    tabelaAnterior = document.getElementById("tabela")
    if(tabelaAnterior != null){
        document.getElementsByTagName("body")[0].removeChild(tabelaAnterior)
    } 
}

function main(){
    iter = 1
    cancelSimulation()
    cleanTable()
    
    // Getting data
    quantum = document.getElementById("1").value
    overload = document.getElementById("2").value
    interval = document.getElementById("3").value
    info = document.getElementById("4").value
    algorithm = document.querySelector('input[name="alg"]:checked').value
    iotime = 5

    
    
    // Allocating processes
    processesLines = info.split("\n")
    processes = []
    for(var i in processesLines){
        aux = processesLines[i].split(" ")
        processes.push({
            id:parseInt(i)+1, 
            arriveTime:parseInt(aux[0]), 
            execTime:parseInt(aux[1]), 
            deadline:parseInt(aux[2]), 
            priority:parseInt(aux[3]),
            totalTime:parseInt(aux[1]),
            inIO:false
            exists:false
        });
    }

    simalacao = new SimulationFIFO(processes,2,3,4)
    simalacao.checkArrived()
    console.log(simalacao)

    // Compare functions
    compareByArrive = function(a,b){return a.arriveTime - b.arriveTime}
    compareByExec = function(a,b)
    {
       if(a.execTime != b.execTime){
           return a.execTime - b.execTime
       }
       else{
           return a.arriveTime - b.arriveTime
       }
    }
    compareByPriority = function(a,b){return b.priority - a.priority}
    compareByDeadline = function(a,b){return a.deadline - b.deadline}

    // Sort processes by arrive
    processesByArrive = processes.slice()
    processesByArrive.sort(compareByArrive)
   
    // Set config for each algorithm
    if(algorithm == "FIFO" ){
        quantum = getMaxExecTime(processes) + 1
        overload = 0
        readyQueue = new NormalQueue()
    }
    else if(algorithm == "ROUND"){
        if(quantum <= 0){
            return
        }
        readyQueue = new NormalQueue()
    }
    else if(algorithm == "SJF"){       
        quantum = getMaxExecTime(processes) + 1
        overload = 0
        readyQueue = new PriorityQueue({ comparator: compareByExec })
    }
    else if(algorithm == "EDF"){
        if(quantum <= 0){
            return
        }
        readyQueue = new PriorityQueue({ comparator: compareByDeadline })
    }

    // console.log(quantum)

    // Run algorithm
    finalTable = []
    count = processes.length
    currentTime = 0
    usedQuantum = quantum
    usedOverload = overload
    usedIOTime = iotime
    preemption = false
    current = null
    contadorzinho = 0
    // update = function()
    while(true)
    {
        
        // Arrive check
        for(var i in processes){
            if(processes[i].arriveTime == currentTime){
                processes[i].exists = true
                readyQueue.queue(processes[i])
            }
            if(processes[i].exists){
                processes[i].deadline--
            }
        }

        // This means process in IO queue is free
        if(usedIOTime == 0){
            usedIOTime = iotime
            // 
        }

        // This means preemption is over or it didnt happen
        if(usedOverload == 0 && usedQuantum == 0){
            preemption = false
            usedOverload = overload
            usedQuantum = quantum       
            readyQueue.queue(current)
            current = null                     
        }

        // This means preemption begun
        if(usedQuantum == 0 && overload > 0){
            usedOverload--
            preemption = true
        }  

        
        if(preemption == false){
            // Determine current
            if(current == null && readyQueue.length != 0){
                current = readyQueue.dequeue()
            }
            // Execute
            if(current != null){
                current.execTime--
            }                        
        }

        // Allocates and updates column
        currentColumn = []
        for(var i in processes){
            if(current == processes[i]){
                if(preemption == true){
                    value = "X"
                    processes[i].totalTime++
                }
                else{
                    if(current.deadline < 0 && algorithm == "EDF"){
                        value = "L"
                    }
                    else{
                        value = "E"
                    }
                }                
            }
            else if (processes[i].exists == true){
                value = "-"
                processes[i].totalTime++
            }
            else{
                value = " "
            }
            currentColumn.push(value)
        }
        finalTable.push(currentColumn)

        // Verify if process ended execution before preemption happens, else, if its executing, usedQuantum--
        if(current != null && current.execTime == 0){
            count--
            current.exists = false
            usedQuantum = quantum
            current = null
        }
        else if (preemption == false){
            usedQuantum--
        }

        // If processes ended
        if(count <= 0){
            break
        }

        // Updates time
        currentTime++
    }

    // Imprime tabela
    tabelaAnterior = document.getElementById("tabela")
    if(tabelaAnterior != null){
        document.getElementsByTagName("body")[0].removeChild(tabelaAnterior)
    }    
    tabela = document.createElement("table")
    tabela.setAttribute("id", "tabela")
    
    // First row (header)
    firstRow = document.createElement("tr")
    for(var i = 0; i < finalTable.length+1; i++){
        cell = document.createElement("th")
        cell.setAttribute("class", "processCell")
        cell.innerHTML = parseInt(i);
        firstRow.appendChild(cell)
    }
    tabela.appendChild(firstRow)

    // Other columns and rows
    for(var j = 0; j < processes.length; j++){
        row = document.createElement("tr")
        cell = document.createElement("td")
        cell.setAttribute("class", "processCell")
        cell.innerHTML = "P"+((parseInt(j)+1));
        row.appendChild(cell)
        for(var i = 0; i < finalTable.length; i++){
            cell = document.createElement("td")
            a = finalTable[i][j];
            if(a == "E"){
                cell.setAttribute("class", "execCell");
            }                
            if(a == "X"){
                cell.setAttribute("class", "prepCell");
            }                
            if(a == "-"){
                cell.setAttribute("class", "waitCell");
            }                
            if(a == "L"){
                cell.setAttribute("class", "lateCell");
            }                
            if(a == " "){
                cell.setAttribute("class", "blnkCell");
            }                
            row.appendChild(cell);
        }
        tabela.appendChild(row)
    }      
    document.getElementsByTagName("body")[0].appendChild(tabela)
    
    rows = document.getElementById("tabela").childNodes
    
    
    update  = function()
    {      
        for(var i = 1; i < rows.length; i++){
            cell = rows[i].childNodes[iter]
            cellClass = cell.getAttribute("class");
            if (cellClass == "execCell"){
                color = "lightgreen";
            } 
            if (cellClass == "prepCell"){
                color = "red";
            } 
            if (cellClass == "waitCell"){
                color = "yellow";          
            } 
            if (cellClass == "lateCell"){
                color = "lightgray";
            } 
            if (cellClass == "blnkCell"){
                color = "white";
            }             
            cell.style.backgroundColor = color;
        }
        iter = iter + 1
        
    }
    intervalExecution = setInterval(update, interval)

    // Imprime turnaround
    sum = 0
    for(var i in processes){
        sum = sum + processes[i].totalTime
    }
    turnaraound = sum/processes.length
    
    textAnterior = document.getElementById("turnaround")
    if(textAnterior != null){
        document.getElementsByTagName("body")[0].removeChild(textAnterior)
    }  
    text = document.createElement("p")
    text.setAttribute("id", "turnaround")
    text.innerHTML = "Turnaround Médio = "+turnaraound
    document.getElementsByTagName("body")[0].appendChild(text)
    // intervalExecution = setInterval(update, interval)
    // console.log(count)
    // console.log(processes)   
}

