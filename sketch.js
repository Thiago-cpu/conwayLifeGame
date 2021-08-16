class Molecule{
    constructor({cellSize}){
        this.cellSize = cellSize
        this.size = this.getSize()
        this.rows = this.size.height / this.cellSize
        this.columns = this.size.width / this.cellSize
        this.cells = []
        this.nextCells = []
        this.cellAliveColor = this.randomColor()
        this.cellsAlive = []
        this.era;
    }
    displayCells = () => {
        for (let row = 0; row < this.rows; row++){
            this.cells[row] = []
            for(let column = 0; column <this.columns; column++){
                this.cells[row].push(new Cell({row, column, size: this.cellSize}))
            }
        }
    }
    mouseReleased = () => {
        this.init()
        
    }

    init = () => {
        clearInterval(this.era)
        this.cellsAlive = []
        for (let row = 0; row<this.rows; row++){
            for(let column = 0; column <this.columns; column++){
                if(this.cells[row][column].isAlive){ 
                    this.cells[row][column].morir()
                }
                if(Math.random() > 0.5) {
                    this.cells[row][column].vivir(this.cellAliveColor)
                    this.cellsAlive.push(this.cells[row][column])
                }
            }
        }
        this.era = setInterval(this.mitosis, 10)
       

    }

    mitosis = () => {
        this.cellAliveColor = this.randomColor()
        const cellsToSurvive = []
        const cellsToDie = []
        
        for(let i = 0; i<this.cellsAlive.length; i++){
            const cellAlive = this.cellsAlive[i]
            let neighborsAlive = 0
            this.forEachAround(cellAlive, (cellAround) => {
                
                if (cellAround.isAlive) {
                    neighborsAlive++
                } else {
                    if(cellAround.checked) return
                    
                    let aroundNeighborsAlive = 0
                    this.forEachAround(cellAround, (aroundCellAround) => {
                        if(aroundCellAround.isAlive) aroundNeighborsAlive++
                    })
                    if(aroundNeighborsAlive===3) {
                        cellsToSurvive.push(cellAround)
                        cellAround.checked = true
                    }
                }
            })
            if(neighborsAlive === 2 || neighborsAlive === 3){
                cellsToSurvive.push(cellAlive)
  
            }else{
                cellsToDie.push(cellAlive)
            }
        }
        cellsToSurvive.forEach(cell => {
            if(!cell.isAlive) {
                cell.vivir(this.cellAliveColor)
            }
            cell.checked = false
        })
        cellsToDie.forEach(cell => {
            cell.morir()
            cell.checked = false
        })
        if(this.areTheSame(this.cellsAlive, cellsToSurvive)) clearInterval(this.era)
        this.cellsAlive = cellsToSurvive


    }
//     Si una célula está viva y tiene dos o tres vecinas vivas, sobrevive en otro caso muere.
//     Si una célula está muerta y tiene tres vecinas vivas, nace.


    getCopy = (matrix) => {
        let copy = []
        for(let i of matrix){
            copy.push([...i])
        }
        return copy
    }

    areTheSame = (arr1,arr2) => {
        if(!(arr1.length === arr2.length)) return false
        for(let i = 0; i<arr1.length; i++){
            if(arr1[i] != arr2[i]) return false
        }
        return true
    }

    forEachAround = (cell, fn) =>{
        for(let i = -1; i <=1; i++){
            for(let j = -1;j<=1; j++){
                if(i==0 && j==0)continue;
                const row = cell.row + i
                const col = cell.column + j
                if(this.cells[row] && this.cells[row][col]){
                    const cellAround = this.cells[row][col]
                    fn(cellAround)
                }
            }
        }
        
    }

    randomColor = () => {
        const rand = () => Math.floor(Math.random() * 205 + 50)
        return `rgb( ${rand()}, ${rand()}, ${rand()})`
    }

    getSize = () => {
        let width = windowWidth - 40
        width = width - width % this.cellSize
        let height = windowHeight - 40
        height = height - height%this.cellSize
        return {
            width,
            height
        }
    }
    updateSize = () => {
        this.size = this.getSize()
        this.rows = this.size.height / this.cellSize
        this.columns = this.size.width / this.cellSize
        return {
            width: this.size.width,
            height: this.size.height
        }
    }
}


class Cell{
    constructor({row, column, size, color = "white"}){
        this.row = row
        this.column = column
        this.position = {
            x: size * column,
            y: size * row
        }
        this.isAlive = false
        this.size = size
        this.color = color
        this.draw()
    }

    morir = () => {
        this.isAlive = false
        this.setColor("white")
    }

    vivir = (newColor) => {
        this.isAlive = true
        this.setColor(newColor)
    }
    
    draw = () => {
        fill(this.color)
        square(this.position.x, this.position.y, this.size)
    }
    setColor = (color) => {
        this.color = color
        this.draw()
    }
}

let cnv;
let mol;

function setup(){
    
    mol = new Molecule({cellSize: 20})
    cnv = createCanvas(mol.size.width,mol.size.height)
    cnv.parent('molecula')
    cnv.mouseReleased(mol.mouseReleased)
    mol.displayCells()
    
}
function draw(){

}
function windowResized(){
    const {width, height} = mol.updateSize()
    resizeCanvas(width,height)
    mol.displayCells()
}