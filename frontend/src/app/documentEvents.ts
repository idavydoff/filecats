import game from "./Game";
import socket from "./socket";
import { showJoinError } from "./utils";

const closeMessageModalListener = () => {
  const closeButton = document.querySelector<HTMLButtonElement>('#message-modal #modal-close');
  const wrapper = document.querySelector<HTMLDivElement>('.modal-wrapper');
  const messageModal = document.querySelector<HTMLDivElement>('#message-modal');

  closeButton!.addEventListener('click', () => {
    wrapper!.className = 'modal-wrapper closed';
    messageModal!.className = 'nes-container is-dark modal closed';
  })
}

const uploadFileListener = () => {
  let canSend = true;
  const sendInput = document.querySelector<HTMLInputElement>('#send-file input')!;
  const sendButton = document.querySelector<HTMLInputElement>('#send-file')!;
  const sendButtonText = document.querySelector<HTMLSpanElement>('#send-file span')!;
  sendInput.addEventListener('change', (e) => {
    if (!canSend) return;
    const file = (<HTMLInputElement>e.target).files![0];
    if (file.size > 5000000) return;
    
    const blob = new Blob([`${game.username}––––${file.name}––––${file.type || 'text/plain'}––––`, file], { type: file.type })

    socket.send(blob);

    canSend = false;
    sendButtonText.innerText = 'Wait 15 seconds';
    sendButton.className = 'nes-btn button is-disabled';
    setTimeout(() => {
      canSend = true;
      sendButtonText.innerText = 'Select file (max 5MB)';
      sendButton.className = 'nes-btn button'
    }, 15000)
  })
}

const joinListener = () => {
  const authInput = document.querySelector<HTMLInputElement>('#auth-input');
  const authButton = document.querySelector<HTMLButtonElement>('#auth-button')!;

  let canJoin = true;
  authButton!.addEventListener('click', () => {
    if (!canJoin) return;

    const value = authInput!.value || '';
    authInput!.value = '';

    let error = '';

    if (Object.keys(game.cats).length === 50) {
      error = 'Cats limit reached';
    } else if (game.cats[value]) {
      error = 'Cat with such username is already connected';
    } else if (!/^[A-Za-z0-9]*$/.test(value)) {
      error = 'Username can only consist of English letters and numbers';
    } else if (value.length > 13) {
      error = 'Username can only be up to 13 characters length';
    }
    
    if (error) {
      showJoinError(error);
      canJoin = false;

      authButton.className = "nes-btn is-disabled";

      setTimeout(() => {
        authButton.className = "nes-btn is-success";
        canJoin = true;
      }, 3000);
      return;
    }


    game.start(value);
  });
}

export const documentEvents = () => {
  closeMessageModalListener();
  uploadFileListener();
  joinListener();
}