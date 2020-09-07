let Board=function(doc){
    let boardDiv=doc.getElementById("board");

    let boardArray=[];

    let clickedElementIndex=0;

    function createDomElements(boardDiv){
        for(let i=0;i<9;i++){
            let temp=doc.createElement("div");
            boardArray.push(temp);
            boardDiv.appendChild(temp);
        }
    }

    function eventCallBack(){
        return function(x){
            let div=x.target;
            boardArray.forEach((temp,i)=>{
                if(temp===div){
                    clickedElementIndex=i;
                }
            });
        }
    }

    function addEventsToElements(){
        boardArray.forEach((element)=>{
            element.addEventListener("click", eventCallBack());
        })
    }

    function createBoard(){
        let boardDiv=doc.getElementById("board");
        createDomElements(boardDiv);
        addEventsToElements();
    }


    function getIndex(){
        return clickedElementIndex;
    }

    function reset(){
        for(let i=0;i<9;i++)boardArray[i].textContent="";
    }

    return{
        boardArray,
        boardDiv,
        getIndex,
        createBoard,
        reset
    };
};

let player=(character, id)=>{
    
    let char=character;   
    let score=0;
    let ai=false;
    let domElement=document.getElementById(id);
    
    let aiElement=document.getElementById(`${id}ai`);
    aiElement.addEventListener("click", ()=>{
        ai=true^ai; 
        if(ai){
            aiElement.style.backgroundColor="rgba(8, 133, 133, 0.705)";
            aiElement.style.borderStyle="solid";
        }
        else{
            aiElement.style.backgroundColor="rgba(10, 224, 224, 0.315)";
            aiElement.style.borderStyle="none";
        }    
    });

    function displaySCore(){
        let temp=domElement.textContent.lastIndexOf(":");
        let temp2=domElement.textContent.indexOf(":");
        domElement.textContent=domElement.textContent.slice(0, temp+1);
        domElement.textContent+=score;
    }

    function increaseScore(){
        score++;
        displaySCore();
    }

    function randomMove(arr){
        while(true){
            let index=Math.floor(9*Math.random());
            if(arr[index].textContent==""){
                console.log(index, "random");
                return index;
            }
        }
    }

    function myLineComplete(char, arr){
        let index=-1;
        let charArr=[];
        for(let i=0;i<9;i++){
            if(arr[i].textContent==char){
                charArr.push(i);
            }
        }
        const a=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        a.forEach((x)=>{
            let temp=x.filter((y)=>{
                return charArr.indexOf(y)==-1;
            })
            if(temp.length==1 && arr[temp[0]].textContent==""){
                index=temp[0];
                return ;
            }
        })
        console.log(index, "logic");
        return index;
    }
    

    function bestMove(oppChar, arr){
        let charArr=[];
        for(let i=0;i<9;i++){
            if(arr[i].textContent==oppChar){
                charArr.push(i);
            }
        }
        //find all opp char. find all spaces. each space gets valeu based on how ,many op char lines can be drawn throgh. pick randomly from max
        let spaceArr=[];
        let spaceScore=[];
        for(let i=0;i<9;i++){
            if(arr[i].textContent!="X" && arr[i].textContent!="O"){
                spaceArr.push(i);
                spaceScore.push(0);
            }
        }

        const a=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        charArr.forEach((charIndex)=>{
            spaceArr.forEach((spaceIndex,i)=>{
                a.forEach((x)=>{
                    if(x.indexOf(spaceIndex)>-1)
                        spaceScore[i]+=1;
                    if(x.indexOf(charIndex)>-1 && x.indexOf(spaceIndex)>-1){
                        spaceScore[i]+=1;
                        let thirdIndex;
                        for(let t=0;t<3;t++){
                            if(x.indexOf(charIndex)!=t && x.indexOf(spaceIndex)!=t)
                                thirdIndex=t;
                        }
                        if(spaceArr.indexOf(x[thirdIndex])>-1){
                            spaceScore[i]+=1;
                        }
                    }
                });
            });
        });
        console.log(spaceScore, spaceArr);
        let max=spaceScore.reduce((x, element)=>{
            if(x<element)
                return element;
            else
                return x;
        },0);

        let spaceArr2=spaceArr.filter((element,i)=>{
            return (spaceScore[i]==max);
        })

        let index=spaceArr2[Math.floor(Math.random()*spaceArr2.length)];
        console.log(index, "best move");
        return index;
    }

    function aiMove(arr){
        let count=0;
        let index=0;
        arr.forEach((element)=>{
            if(element.textContent!=""){
                count++;
            }
        });

        if(count==0){
            index=randomMove(arr);
        }
        else{
            if(count<=0){
                index=myLineComplete(this.char, arr);
                if(index>=0 && arr[index].textContent=="")return index;
                index=myLineComplete(this.char=="X"?"O":"X", arr);
                if(index>=0 && arr[index].textContent=="")return index;
                index=bestMove(this.char=="X"?"O":"X", arr);
            }
            else{
                let arrCopy=arr.map((element,i)=>{
                    if(element.textContent=="")
                        return i;
                    else   
                        return element.textContent;
                });
                let spaceArr=[];
                let spaceScore=[];
                for(let i=0;i<9;i++){
                    if(arrCopy[i]!="X" && arrCopy[i]!="O"){
                        spaceArr.push(i);
                        spaceScore.push(0);
                    }
                }
                for(let i=0;i<spaceArr.length;i++){
                    arrCopy[spaceArr[i]]=this.char;
                    spaceScore[i]=minmax(this.char=="O"?true:false, arrCopy);
                    arrCopy[spaceArr[i]]=spaceArr[i];
                    console.log(spaceScore[i]);
                }
                if(this.char=="X"){
                    let max=-1;
                    for(let i=0;i<spaceArr.length;i++){
                        if(spaceScore[i]>max){
                            max=spaceScore[i];
                            index=spaceArr[i];
                        }
                    }
                }
                else{
                    let min=1;
                    for(let i=0;i<spaceArr.length;i++){
                        if(spaceScore[i]<min){
                            min=spaceScore[i];
                            index=spaceArr[i];
                        }
                    }
                }
            }
        }
        console.log(index);
        return index;
    }

    function minmax(maximise, arr){
        if(win(arr)==true){
            if(maximise==true)
                return -10;
            else
                return 10;
        }
        else if(tie(arr)==true){
            return 0;
        }
        let spaceArr=[];
        let spaceScore=[];
        for(let i=0;i<9;i++){
            if(arr[i]!="X" && arr[i]!="O"){
                spaceArr.push(i);
                spaceScore.push(0);
            }
        }
        
        for(let i=0;i<spaceArr.length;i++){
            arr[spaceArr[i]]=maximise?"X":"O";
            spaceScore[i]=minmax(maximise?false:true, arr);
            arr[spaceArr[i]]=spaceArr[i];
        }

        if(maximise==true){
            let max=-1;
            for(let i=0;i<spaceArr.length;i++){
                if(spaceScore[i]>max){
                    max=spaceScore[i];
                }
            }
            return max;
        }
        else{
            let min=1;
            for(let i=0;i<spaceArr.length;i++){
                if(spaceScore[i]<min){
                    min=spaceScore[i];
                }
            }
            return min; 
        }
    }


    function win(arr){
        const a=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        let ans=a.reduce((t,x)=>{
            if(arr[x[0]]!="" && arr[x[0]]==arr[x[1]] && arr[x[0]]==arr[x[2]]){
                return true;
            }
            else return t;
        },false);
        return ans;
    }

    function tie(arr){
        for(let i=0;i<9;i++){
            if(arr[i]!="X" && arr[i]!="O")
                return false;
        }
        return true;
    }

    function getai(){
        return ai;
    }

    return{
        char,
        score,
        getai,
        increaseScore,
        aiMove
    };
}


(function gameFLow(){
   
    let board=Board(document);
    board.createBoard();

    let p1=player("X", "p1");
    let p2=player("O", "p2");


    let currentPlayer=p1;

    board.boardDiv.addEventListener("click", playMove());

    function playMove(){

        return function(){
            let index;
            if(currentPlayer.getai()==true){
                index=currentPlayer.aiMove(board.boardArray);
            }
            else{
                index=board.getIndex();
            }

            if(board.boardArray[index].textContent==""){
                board.boardArray[index].textContent=currentPlayer.char;
                let control=gameOver();
                if(control=="win"){
                    currentPlayer.increaseScore();
                    alert(`${currentPlayer.char} wins`);
                    board.reset();
                }
                else if(control=="tie"){
                    alert("tie");
                    board.reset();
                }
                else{
                    currentPlayer=currentPlayer==p1?p2:p1;
                }

            }
        }
    }

    function gameOver(){
        const ROWS=[[0,1,2],[3,4,5],[6,7,8]];

        function text(index){
            return board.boardArray[index].textContent;
        }

        for(let i=0;i<3;i++){
            if(text(ROWS[i][0])!="" && text(ROWS[i][0])==text(ROWS[i][1]) && text(ROWS[i][0])==text(ROWS[i][2])){
                return "win";
            }
        }
        for(let i=0;i<3;i++){
            if(text(ROWS[0][i])!="" && text(ROWS[0][i])==text(ROWS[1][i]) && text(ROWS[0][i])==text(ROWS[2][i])){
                return "win";
            }
        }

        if(text(0)!="" && text(0)==text(4) && text(0)==text(8)){
            return "win";
        }

        if(text(4)!="" && text(2)==text(4) && text(2)==text(6)){
            return "win";
        }

        for(let i=0;i<9;i++){
            if(text(i)=="")
                return ;
        }

        return "tie";
    }
})()
