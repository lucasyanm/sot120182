class Memory{
	constructor(npages){
        this.realMemory = Array(50).fill(null)
        this.pointer = 0
        this.npages = npages
    }

    referencePages(processNumber, currentTime){}

    putPages(processNumber){}

    incrementPointer(){
    	this.pointer++
    	if(this.pointer == 50){
    		this.pointer = 0
    	}
    }   

    hasAllPages(processNumber){
    	for (var i = processNumber*(this.npages); i < (processNumber+1)*this.npages; i++){
    		if(this.virtualMemory[i] == null){
    			return false
    		}
    	}
    	return true
    }

    showMemory(){
    	// console.log("Memoria virtual:")
    	// for(var i = 0; i < this.virtualMemory.length; i++){
    	// 	if(this.virtualMemory[i] != null){
    	// 		console.log(parseInt(i)+" "+parseInt(this.virtualMemory[i]))
    	// 	}
    	// 	else{
    	// 		console.log(parseInt(i)+"  ")
    	// 	}
    	// }

    	// console.log("Memoria real:")
    	// for(var i = 0; i < this.realMemory.length; i++){
    	// 	if(this.realMemory[i] != null){
    	// 		console.log(parseInt(i)+" "+parseInt(this.realMemory[i]))
    	// 	}
    	// 	else{
    	// 		console.log(parseInt(i)+"  ")
    	// 	}
    	// }
    }
}



class MemoryFIFO extends Memory{
    constructor(npages, nProcesses){
        super(npages)
        this.virtualMemory = Array(nProcesses*npages).fill(null)
        this.fifoQueue = []
    }



    putPages(processNumber, currentNumber){
    	for (var i = (processNumber)*(this.npages); i < (processNumber+1)*this.npages; i++){
            if(this.virtualMemory[i] == null){
                // console.log("Colocando página "+i)
                this.fifoQueue.push(i)
                // console.log(this.fifoQueue)
                if(this.realMemory[this.pointer] == null){
                    this.virtualMemory[i] = this.pointer
                    this.virtualMemory[ this.realMemory[this.pointer] ] = null
                    this.realMemory[this.pointer] = i
                    this.incrementPointer()
                }
                else{
                    let aux = []
                    // console.log("Topo = "+this.fifoQueue[0])
                    // console.log("Owner = "+parseInt(this.fifoQueue[0]/this.npages))
                    while(parseInt(this.fifoQueue[0]/this.npages) == currentNumber || 
                         parseInt(this.fifoQueue[0]/this.npages) == processNumber){
                        // console.log("Topo = "+this.fifoQueue[0])
                        aux.push(this.fifoQueue[0])
                        this.fifoQueue.splice(0, 1)
                        // console.log("Ficou assim:")
                        // console.log(this.fifoQueue)
                    }
                    let victmPage = this.fifoQueue[0]
                    let frame = this.virtualMemory[victmPage]
                    this.virtualMemory[victmPage] = null
                    this.virtualMemory[i] = frame
                    this.realMemory[frame] = i
                    this.fifoQueue.splice(0,1)
                    this.fifoQueue = aux.concat(this.fifoQueue)
                }
    		}            
    	}  	
    }

}

class MemoryMRU extends Memory{
	constructor(npages, nProcesses){
		super(npages)
        this.virtualMemory = Array(nProcesses*this.npages).fill(null)
        this.referenceCount = Array(nProcesses*this.npages).fill(0)
	}

    showReferenceCount(){
        for (var i = 0; i < this.referenceCount.length; i++) {
            // console.log(this.referenceCount[i])
        }
    }

    referencePages(processNumber, currentTime){

        // console.log("Processo "+(parseInt(processNumber)+1)+" referenciou")
        let firstPage = (processNumber)*(this.npages)
        for(var i=0; i < this.npages; i++){
            this.referenceCount[parseInt(firstPage)+parseInt(i)] = currentTime;
        }
        this.showReferenceCount()
    }

    findMinCount(processNumber, currentNumber){
        let min = Infinity
        let chosen = null
        for(var i=0; i < this.realMemory.length; i++){            
            let owner = parseInt(this.realMemory[i]/this.npages)
            let refCount = this.referenceCount[this.realMemory[i]]
            // console.log("Posição "+i+": Pág "+this.realMemory[i]+" count = "+refCount)
            if(owner != processNumber && owner != currentNumber && refCount < min){
                min = this.referenceCount[this.realMemory[i]]
                // console.log("Chosen recebe "+this.realMemory[i])
                chosen = this.realMemory[i]
            }
        }
        // console.log("Escolhida = "+chosen)
        return chosen
    }

    putPages(processNumber, currentNumber){
        let firstPage = (processNumber)*this.npages
        // console.log("Bota as páginas de P"+(parseInt(processNumber)+1))

        for (var i = 0; i < this.npages; i++){
            let currentPage = parseInt(firstPage)+parseInt(i)

            if(this.virtualMemory[currentPage] == null){
                // console.log("Pointer = "+this.pointer)
                if(this.realMemory[this.pointer] == null){
                    // console.log("Botou direto")
                    this.virtualMemory[currentPage] = this.pointer
                    this.virtualMemory[ this.realMemory[this.pointer] ] = null
                    this.realMemory[this.pointer] = currentPage
                    this.incrementPointer()
                }
                else{
                    // console.log("Memoria real cheia")
                    let victmPage = this.findMinCount(processNumber, currentNumber)
                    // console.log("Escolhida = "+victmPage+ "(Processo "+(parseInt(victmPage/this.npages)+1)+")")
                    let frame = this.virtualMemory[victmPage]
                    this.virtualMemory[victmPage] = null
                    this.virtualMemory[currentPage] = frame
                    this.realMemory[frame] = currentPage
                }
            }
        }
        // this.showMemory()
    }
}
