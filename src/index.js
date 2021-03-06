import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
	      <button className="square" id={props.id} onClick={props.onClick}>
	          {props.value}
	      </button>
	  );
}

class Board extends React.Component {

    renderSquare(i) {
        return(
            <Square key={i}
                id = {i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
      return  (
        <div>
          {
            Array.apply(null, Array(3)).map((item, i)=>{
              return (
                <div className="board-row" key={i}>
                {
                    Array.apply(null, Array(3)).map((item, j)=>{
                        return this.renderSquare(i*3+j);
                    })
                }
                </div>
              );
            })
          }
        </div>
      );
   }
}

class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          id: Math.random(10),
          squares: Array(9).fill(null),
          position: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        ascending: false,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([
          {
            id: Math.random(10),
            squares:squares,
            position:i,
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    isTie(squares) {
        for(let i=0;i<squares.length;i++){
            if(squares[i]==null){
                return false;
            }
        }
        return true;
    }

    reorder(){
        var ascending;
        //var step;

       if(this.state.ascending){
           ascending = false;
       } else{
           ascending = true;
       }
      this.setState({
          ascending: ascending,
      });
    }

    render() {
        var history = JSON.parse(JSON.stringify(this.state.history));
        const current = this.state.history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        var moveNumber = 0;
        
        if(this.state.ascending){
            history = history.reverse();
        }
        const moves = history.map((step, move) => {
            if(this.state.ascending){
                moveNumber = (this.state.history.length-1) - move;
            }
            else{
                moveNumber = move;
            }
            
            const player = (moveNumber % 2) ? "X" : "O";
            const position = history[move].position;
            const desc = moveNumber ?
               'Go to move #' + moveNumber + " " + player + " placed at position " + position :
               'Go to game start';
            if(this.state.ascending){
                return (
                  <li key={move}>
                     <button onClick ={() => this.jumpTo((this.state.history.length-1) - move)}>{desc}</button>
                  </li>
                );
            }
            else{
                return (
                  <li key={move}>
                     <button onClick ={() => this.jumpTo(move)}>{desc}</button>
                  </li>
                );
            }
        });

        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else if(this.isTie(current.squares)){
          status = 'There has been a tie.'
        } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
	         <div className="game">
		           <div className="game-board">
		               <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                      />
		           </div>

                   <div className="game-info">
		              <div>{status}</div>
                      <div>
                        <button onClick={()=>{this.reorder()}}>Reorder</button>
                      </div>
		              <ul>
                        {moves}
                      </ul>
		         </div>
	         </div>
        );
    }
}

// ========================================================

ReactDOM.render (
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      document.getElementById(a).className="winning-square";
      document.getElementById(b).className="winning-square";
      document.getElementById(c).className="winning-square";
      return squares[a];
    }
    else{
        for (let i = 0; i < squares.length; i++){
            if(document.getElementById(i)!=null){
                document.getElementById(i).className="square";
            }
        }
    }
  }
  return null;
}
