import { Application, Rectangle, SCALE_MODES, Sprite, Text } from "pixi.js";
import { mainTextStyle } from "./styles";
import { app } from "../app";

export class CatEntity {
  entity: Sprite;
  text: Text;
  direction: number;
  turningSpeed: number;
  speed: number;

  constructor(app: Application, name: string, type: 'you' | 'user') {
    const dude = Sprite.from('./assets/img/cat.png');
    dude.anchor.set(0.5);
    dude.scale.set(3);
    dude.zIndex = 0;
  
    dude.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  
    dude.x = Math.random() * app.screen.width;
    dude.y = Math.random() * app.screen.height;
  
    dude.tint = Math.random() * 0xFFFFFF;
  
    const text = new Text(name, {
      ...mainTextStyle,
      fontSize: 10,
      fill: type === 'user' ? '#ffffff' : 'red',
    });
    text.x = dude.x;
    text.y = dude.y;
    text.anchor.set(0.5, -2.25);
  
    app.stage.addChild(dude);
    app.stage.addChild(text);

    this.entity = dude;
    this.text = text;
    this.direction = Math.random() * Math.PI * 2;
    this.turningSpeed = Math.random() - 0.8;
    this.speed = 3 + Math.random() * 3;
  }

  nextMove(dudeBounds: Rectangle) {
    this.direction += this.turningSpeed * 0.01;
  
    this.text.x += Math.sin(this.direction) * this.speed;
    this.text.y += Math.cos(this.direction) * this.speed;
    this.text.rotation = -this.direction - Math.PI / 2;

    this.entity.x += Math.sin(this.direction) * this.speed;
    this.entity.y += Math.cos(this.direction) * this.speed;
    this.entity.rotation = -this.direction - Math.PI / 2;

    // wrap the dudes by testing their bounds...

    // left border
    if (this.entity.x < dudeBounds.x) {
      this.text.x += dudeBounds.width;
      this.entity.x += dudeBounds.width;
      this.turningSpeed = Math.random() - 0.8;
      this.direction = Math.random() * Math.PI * 2;
      // right border
    } else if (this.entity.x > dudeBounds.x + dudeBounds.width) {
      this.text.x -= dudeBounds.width;
      this.entity.x -= dudeBounds.width;
      this.turningSpeed = Math.random() - 0.8;
      this.direction = Math.random() * Math.PI * 2;
    }

    // top border
    if (this.entity.y < dudeBounds.y) {
      this.text.y += dudeBounds.height;
      this.entity.y += dudeBounds.height;
      this.turningSpeed = Math.random() - 0.8;
      this.direction = Math.random() * Math.PI * 2;
      // bottom border
    } else if (this.entity.y > dudeBounds.y + dudeBounds.height) {
      this.text.y -= dudeBounds.height;
      this.entity.y -= dudeBounds.height;
      this.turningSpeed = Math.random() - 0.8;
      this.direction = Math.random() * Math.PI * 2;
    }
  }

  destroy() {
    app.stage.removeChild(this.entity);
    app.stage.removeChild(this.text);
  }
}