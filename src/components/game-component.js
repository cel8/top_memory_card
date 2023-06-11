import { useCallback, useEffect, useState } from "react";
import GameHeaderComponent from "./game-header-component";
import CardController from "./card-controller";

const GameComponent = (props) => {
  const LEVEL_MIN = 1;
  const LEVEL_MAX = 10;

  const [gameover, setGameOver] = useState(false);

  const [level, setLevel] = useState(LEVEL_MIN);

  const [cardCount, setCardCount] = useState(0);

  const [score, setScore] = useState({
    current: 0,
    best: 0
  });

  const getCardQuantity = useCallback(() => level * 2, [level]);

  const [cards, setCards] = useState();

  const updateScore = useCallback(() => {
    const bestScore = score.current + 1 > score.best ? score.current + 1 : score.best;
    setScore({
      current: score.current + 1,
      best: bestScore
    });
  }, [score]);

  const resetCurrentScore = useCallback(() => {
    setScore({
      current: 0,
      best: score.best
    });
  }, [score]);

  const onCardClick = useCallback((id) => {
    // Check visit 
    if (!CardController.getVisit(cards, id)) {
      updateScore();
      CardController.setVisit(cards, id);
      setCards(CardController.shuffle(cards));
      setCardCount(cardCount + 1);
      if ((cardCount + 1) === cards.length) {
        setLevel(level < LEVEL_MAX ? level + 1 : LEVEL_MAX);
      }
    } else {
      resetCurrentScore();
      setGameOver(true);
      setLevel(LEVEL_MIN);
    }
  }, [cards, cardCount, level, LEVEL_MIN, LEVEL_MAX, updateScore, resetCurrentScore])

  useEffect(() => {
    const getCards = async () => await CardController.get(getCardQuantity());
    if (!cards || gameover || (cards && cardCount === cards.length)) {
      getCards().then((values) => setCards(values));
      setGameOver(false);
      setCardCount(0);
    }
  }, [cards, gameover, cardCount, getCardQuantity]);

  return (
    <div className="App-main">
      <GameHeaderComponent level={level} currentScore={score.current} bestScore={score.best}/>
      <div className="gameboard">{
        cards && cards.map((card) => {
          const uuid = card.id;
          return (
            <div key={uuid} className="card-item" onClick={() => onCardClick(uuid)}>
              <img src={card.src} alt={card.name}></img>
              <div>{card.name}</div>
            </div>
          );
        })
      }</div>
    </div>
  )
};

export default GameComponent;
