import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />);
  }

  render() {
    const board  = [];
    const row = 3;
    const col = 3;

    for (let i = 0; i < row; i += 1) {
      const rows = [];
      for (let j = 0; j < col; j += 1) {
        rows.push(this.renderSquare(i * 3 + j));
      }
      board.push(<div className="board-row" key={i}>{rows}</div>);
    }
    return (
      <div>{board}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const move = history.map((step, move) => {
      const locationFormat = createLocationFormat(step.position);
      const desc = move ?
        `Go to move # ${move} ${locationFormat}`:
        'Go to game start';
      const bold = this.state.stepNumber === move ? "bold" : "";

      return (
        <li key={move}>
          <button className={bold} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{move}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
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
      return squares[a];
    }
  }
  return null;
}

function createLocationFormat(position) {
  const column = position % 3 + 1;
  const row = Math.floor(position / 3 + 1);
  return `col:${column} row:${row}`;
}
// ========================================
// 以下はドットインストールのコード

function Counter(props) {
  return (
    <li
      style={{backgroundColor: props.counter.color}}
      onClick={() => props.onClick(props.counter)}
    >
      {props.counter.id}:{props.counter.count}
    </li>
  );
}

function CounterList(props) {
  const counters = props.counters.map(counter => {
    return (
      <Counter
        counter={counter}
        key={counter.id}
        onClick={props.onClick}
      />
    );
  });

  return (
    <ul>
      {counters}
    </ul>
  );
}

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      counters: [
        {id: 'A', count: 0, color: 'tomato'},
        {id: 'B', count: 0, color: 'skyblue'},
        {id: 'C', count: 0, color: 'limegreen'},
      ],
      total: 0,
    };
  }

  handleClick(counter){
    const counters = this.state.counters.slice();
    const position = counters.map(counter => {
      return counter.id;
    }).indexOf(counter.id);
    counters[position].count += 1;

    this.setState(prevState => {
      return {
        counters: counters,
        total: prevState.total + 1,
      };
    });
  }

  render() {
    return (
      <div className="container">
        <h1>React入門</h1>
          <CounterList
            counters={this.state.counters}
            onClick={counter => this.handleClick(counter)}
          />
        <div>TOTAL INVENTORY {this.state.total}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('dotinstall')
);
