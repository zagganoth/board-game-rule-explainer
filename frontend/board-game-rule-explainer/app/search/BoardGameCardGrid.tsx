import React from 'react';
import { HoverEffect } from '../components/card-hover-effect';

interface CardType {
  src: string,
  title: string,
  description: string
}
const BoardGameCardGrid = (props: { games: { [key: string]: string } }) => {
  const cards: CardType[] = [];
  Object.keys(props.games).forEach((gameName: string, index: number) => {
    cards.push({
      src: `/chat?title=${gameName}&description=${props.games[gameName]}`,
      title: gameName,
      description: props.games[gameName]
    });
  });
  return    (<div className=" mx-auto px-4">
  <HoverEffect items={cards} />
</div>);
};

export default BoardGameCardGrid;
