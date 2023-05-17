import {
  Application, Rectangle
} from 'pixi.js';

import { FileEntity } from './app/FileEntity';
import game from './app/Game';
import { documentEvents } from './app/documentEvents';

export const app = new Application<HTMLCanvasElement>({
  background: '#0c031a',
  width: window.innerWidth,
  height: window.innerHeight,
});
document.body.appendChild(app.view);
app.stage.sortableChildren = true;

window.onload = () => {
  documentEvents();

  for (let i = 0; i < 13; i++) {
    game.addCat(`Cat #${i + 1}`);
  }
  
  const dudeBoundsPadding = 75;
  const dudeBounds = new Rectangle(-dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2);
  
  app.ticker.add(() => {
    const aliens = Object.entries(game.cats);
    for (let i = 0; i < aliens.length; i++) {
      const [username, dude] = aliens[i];

      dude.nextMove(dudeBounds);

      if (
        dude.entity.x < app.screen.width - 85 && dude.entity.x > 85
        && dude.entity.y < app.screen.height - 85 && dude.entity.y > 85
      ) {
        const filtered = game.files_queue.filter((m) => m.from == username);
        if (filtered.length) {
          const firstMessage = filtered[0];
          game.files_queue = game.files_queue.filter((m) => m.id !== firstMessage.id);
          
          const entity = new FileEntity(dude.entity.x, dude.entity.y, firstMessage.from, firstMessage.file);

          app.stage.addChild(entity.entity);
        }
      }
    }
  });
}

