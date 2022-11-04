
const items = document.querySelectorAll('.item');
const boxes = document.querySelectorAll('.box');
const boxA = document.querySelector('#b1');
const boxB = document.querySelector('#b2');
const boxC = document.querySelector('#b3');
const notiDiplay = document.querySelector('.noti');
let movecount=0;
let movelogs=[];
movelogs[0]=[boxA.querySelectorAll('.item'),boxB.querySelectorAll('.item'),boxC.querySelectorAll('.item')];
document.getElementById("undoBtn").addEventListener("click",Undo);
document.getElementById("resetBtn").addEventListener("click",Reset);

let idtransfer;
let idtarget;


// attach the dragstart event handler
items.forEach(item => {
    item.addEventListener('dragstart', dragStart);  
});
// handle the dragstart


function dragStart(e) {
    
    notiDiplay.innerHTML="Move Count: "+movecount;//clear notification

    e.dataTransfer.setData('text/plain', e.target.id);
    idtransfer=e.srcElement.getAttribute('id');
   // console.log(e.srcElement.getAttribute('id'));
    
}

boxes.forEach(box => {
    //box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver)
    box.addEventListener('dragleave', dragLeave)
    box.addEventListener('drop', drop)
});
/*
function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}
*/
function dragOver(e) {
    //console.log(e.target.className.split(" ").includes("box"))
    //console.log([].slice.call(e.target.children))
    e.target.classList.add('drag-over');
    
    //determine if the drop is valid
    if(e.target.className.split(" ").includes("box")){//only drop item inside of box, not on top of other items
        if(e.target.children[0]==null){//if target box has no item, allow drop
            e.preventDefault();
        }else if(e.target.children[0].getAttribute('id')>idtransfer){
            idtarget=e.target.children[0].getAttribute('id');
            //if target top item is larger than dragged item, allow drop
            e.preventDefault();
        }              
    }

    //printout invalid move notification if the move is invalid
    if(e.target.className.split(" ").includes("box")){
        notiDiplay.innerHTML="Move Count: "+movecount;
        if([].slice.call(e.target.children).length!==0){
            idtarget=e.target.children[0].getAttribute('id');
            if(idtarget<idtransfer){
                notiDiplay.innerHTML="Invalid move"
            }else{
                notiDiplay.innerHTML="Move Count: "+movecount;
            }
        }
    }
  
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    
    e.target.classList.remove('drag-over');
        
    //check to see what items are in the destination box
    //var arr = [].slice.call(e.target.children);
           
    //get the draggable element and add it to the drop target
    const id=e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);     
    e.target.appendChild(draggable);
    movecount++;
    notiDiplay.innerHTML="Move Count: "+movecount;


    //sort divs/items by id in the target box
    var mylist=e.target;
    var divs=mylist.getElementsByTagName('div');
    var listitems=[];
    for (i = 0; i < divs.length; i++) {
        listitems.push(divs.item(i));
    }
    listitems.sort(function(a, b) {
        var compA = a.getAttribute('id').toUpperCase();
        var compB = b.getAttribute('id').toUpperCase();
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });
    for(i=0;i<listitems.length;i++){
        mylist.appendChild(listitems[i]);
    }

    //log the items' locations into movelogs variable for track keeping
    movelogs[movecount]=[boxA.querySelectorAll('.item'),boxB.querySelectorAll('.item'),boxC.querySelectorAll('.item')];
    

    //only allow the top item in each box to be draggable
    setTopDraggable();

    //check for win condition
    if(boxC.querySelectorAll('.item').length===6){
        notiDiplay.innerHTML="Congratulation! YOU WIN! Your total move is "+movecount;
        items.forEach(item => {
            item.setAttribute('draggable', false);  
        });
    }   
}

function setTopDraggable(){
    if(boxA.querySelectorAll('.item').length!==0){
        for (i=0;i<boxA.querySelectorAll('.item').length;i++){//reset every item to be undraggable first
        boxA.querySelectorAll('.item')[i].setAttribute('draggable',false);
        }
        //then set top item to be draggable
        boxA.querySelectorAll('.item')[0].setAttribute('draggable',true);
    }
    if(boxB.querySelectorAll('.item').length!==0){
        for (i=0;i<boxB.querySelectorAll('.item').length;i++){
        boxB.querySelectorAll('.item')[i].setAttribute('draggable',false);
        }
        boxB.querySelectorAll('.item')[0].setAttribute('draggable',true);
    }
    if(boxC.querySelectorAll('.item').length!==0){
        for (i=0;i<boxC.querySelectorAll('.item').length;i++){
        boxC.querySelectorAll('.item')[i].setAttribute('draggable',false);
        }
        boxC.querySelectorAll('.item')[0].setAttribute('draggable',true);
    }
}

function Undo(){
    if(movecount>0){
        //delete all items in box A, B, C first
        while(boxA.firstChild){
            boxA.removeChild(boxA.firstChild);}
        while(boxB.firstChild){
            boxB.removeChild(boxB.firstChild);}
        while(boxC.firstChild){
            boxC.removeChild(boxC.firstChild);}
        movecount--;
        notiDiplay.innerHTML="Move Count: "+movecount;

        //append items of the previous movecount in each box
        const nodesinA = movelogs[movecount][0];
        for (var i=0;i<nodesinA.length;i++){
            boxA.appendChild(nodesinA[i]);
        }
        for (var i=0;i<movelogs[movecount][1].length;i++){
            boxB.appendChild(movelogs[movecount][1][i]);
        }
        for (var i=0;i<movelogs[movecount][2].length;i++){
            boxC.appendChild(movelogs[movecount][2][i]);
        }

        //only allow the top item in each box to be draggable
        setTopDraggable();        
    }
}

function Reset(){
    if(movecount>0){
        //delete all items in box A, B, C first
        while(boxA.firstChild){
            boxA.removeChild(boxA.firstChild);}
        while(boxB.firstChild){
            boxB.removeChild(boxB.firstChild);}
        while(boxC.firstChild){
            boxC.removeChild(boxC.firstChild);}
        movecount=0;
        notiDiplay.innerHTML="Move Count: "+movecount;
        const nodesinA = movelogs[0][0];
        for (var i=0;i<nodesinA.length;i++){
            boxA.appendChild(nodesinA[i]);
        }
        setTopDraggable();
}
}