import game from "./Game";
import { processFile } from "./utils";

const socket = new WebSocket("wss://filecats.online/ws/");
// const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Connection established");
};

socket.onclose = () => {
  console.log('Connection closed');
};

socket.onmessage = async (event) => {
  if (event.data instanceof Blob) {
    const { from, file } = await processFile(event.data);

    game.add_file(from, file);

    return;
  }

  if (typeof event.data === "string") {
    if (/JOIN\|[A-Za-z][A-Za-z0-9]*$/.test(event.data)) {
      game.addCat(event.data.replace('JOIN|', ''));
    } else if (/LIST\|[A-Za-z,][A-Za-z0-9,]*$/.test(event.data)) {
      const arr = event.data.replace('LIST|', '').split(',');
      arr.forEach((c) => {
        game.addCat(c);
      });
    } else if (/LEFT\|[A-Za-z][A-Za-z0-9]*$/.test(event.data)) {
      game.removeCat(event.data.replace('LEFT|', ''));
    }
  }
};

socket.onerror = (error) => {
  console.log("Socket error: " + error);
};

export default socket;