import { SCALE_MODES, Sprite } from "pixi.js";
import { app } from "../app";
import game from "./Game";
import { formatBytes } from "./utils";

export class FileEntity {
  entity: Sprite;
  from: string;
  file: File;

  constructor(x: number, y: number, from: string, file: File) {
    let index = Math.ceil(Math.random() * 10);
    const entity = Sprite.from(`../assets/img/files/${index}.png`);
    entity.x = x;
    entity.y = y;
    entity.scale.set(1.5);
    entity.anchor.set(.5);
    entity.zIndex = -1;
    entity.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

    entity.eventMode = 'dynamic';
    entity.cursor = 'pointer';

    entity.on('mouseover', onHover, entity);
    entity.on('mouseleave', onLeave, entity);
    entity.on('click', onClick, this);
    entity.on('tap', onClick, this);

    if (from === game.username) {
      entity.tint = 0xFF0000;
    }

    this.entity = entity;
    this.from = from;
    this.file = file;
  }

}


function onHover(this: Sprite) {
  this.alpha = .5;
}

function onLeave(this: Sprite) {
  this.alpha = 1;
}

function onClick(this: FileEntity) {
  app.stage.removeChild(this.entity);
  const wrapper = document.querySelector<HTMLDivElement>('.modal-wrapper')!;
  wrapper.className = 'modal-wrapper';

  const modal = document.querySelector('#message-modal')!;
  modal.className = 'nes-container is-dark modal'

  const modalTitle = document.querySelector<HTMLParagraphElement>('#message-modal .title')!;
  const modalMessage = document.querySelector<HTMLParagraphElement>('#message-modal .message')!;
  
  modalTitle.innerText = `From: ${this.from}`;
  modalMessage.innerHTML = `name: ${this.file.name}<br />size: ${formatBytes(this.file.size)}`;

  const modalDownloadButton = document.querySelector<HTMLParagraphElement>('#message-modal #modal-download')!;
  modalDownloadButton.onclick = () => {
    downloadFile(this.file);
    wrapper!.className = 'modal-wrapper closed';
    modal!.className = 'nes-container is-dark modal closed';
  }
}

function downloadFile(file: File) {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}