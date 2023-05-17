import { app } from "../app";
import { CatEntity } from "./CatEntity";
import socket from "./socket";

interface IFile {
  id: number,
  from: string,
  file: File
}

class Game {
  username: string;
  cats: {[x: string]: CatEntity}; 
  files_queue: IFile[];

  constructor() {
    this.username = '';
    this.cats = {};
    this.files_queue = [];
  }

  start(username: string) {
    socket.send(`JOIN|${username}`);

    this.username = username;

    const buttons = document.querySelector<HTMLDivElement>('#buttons')!;
    const authModal = document.querySelector<HTMLDivElement>('#auth-modal')!;
    const modalWrapper = document.querySelector<HTMLDivElement>('.modal-wrapper')!;
    const welcomeTitle = document.querySelector<HTMLSpanElement>('.welcome-title')!;

    welcomeTitle.remove();
    
    buttons.className = 'buttons-wrapper';
    authModal.className = 'nes-container is-dark modal-join closed';
    modalWrapper.className = 'modal-wrapper closed';
  }

  addCat(username: string) {
    if (this.cats[username]) return;

    this.cats[username] = new CatEntity(app, username, username === this.username ? 'you' : 'user');

    const block = document.querySelector<HTMLSpanElement>('.online-text')!;
    block.innerText = `Online: ${Object.keys(this.cats).length}/50`
  }

  removeCat(username: string) {
    if (!this.cats[username]) return;

    this.cats[username].destroy();
    delete this.cats[username];

    const block = document.querySelector<HTMLSpanElement>('.online-text')!;
    block.innerText = `Online: ${Object.keys(this.cats).length}/50`
  }

  add_file(from: string, file: File) {
    this.files_queue.push({
      id: Math.random(),
      from,
      file,
    })
  }
}

const game = new Game();

export default game;