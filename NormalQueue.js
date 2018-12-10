// UFBA - MATA58
// Trabalho - SO - 2018.2
// Docentes
//     - Alisson Oliveira
//     - Lucas Yan
//     - Vinicius Pinto
// Discente
//     - Maycon Leone M. Peixoto
class NormalQueue{
    constructor(){
        this.arr = []
        this.length = 0
    }
    queue(a){
        if(a != null){
            this.arr.push(a)
            this.length++
        }        
    }
    dequeue(){
        if(this.arr.length > 0){
            this.length--
            return this.arr.shift()
        }
    }
    seek(){
        return this.arr[0]
    }
}