const GameHeaderComponent = (props) => {
  return (
    <header>
      <div>PokéMemory</div>
      <div>Your level: {props.level}</div>
      <div>Current score: {props.currentScore}</div>
      <div>Best score: {props.bestScore}</div>
    </header>
  );
};

export default GameHeaderComponent;
