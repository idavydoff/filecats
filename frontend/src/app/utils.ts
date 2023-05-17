export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const showJoinError = (message: string) => {
  const text = document.querySelector<HTMLParagraphElement>('.error-text')!;

  text.innerText = message;
  text.className = "nes-text is-error error-text";

  setTimeout(() => {
    text.className = "nes-text is-error error-text closed";
  }, 3000);
}

export const processFile = async (blob: Blob) => {
  const arrayBuffer = await new Response(blob).arrayBuffer();
  const u8Array = new Uint8Array(arrayBuffer);

  let splitted: Uint8Array[] = [];
  const pattern = [226, 128, 147, 226, 128, 147, 226, 128, 147, 226, 128, 147];

  let tmp: number[] = [];
  let bodyStartIndex = 0;

  for (let i = 0; i <= u8Array.length; i++) {
    if (splitted.length === 3) {
      bodyStartIndex = i;
      break;
    }
    tmp.push(u8Array[i]);
    if (tmp.length > pattern.length) {
      const sliced = tmp.slice(pattern.length * - 1);
      if (sliced.every((_v, i, arr) => arr[i] === pattern[i])) {
        const data = tmp.slice(0, pattern.length * - 1);
        splitted.push(new Uint8Array(data));
        tmp = [];
      }
    }
  }
  splitted.push(u8Array.slice(bodyStartIndex));

  const from = new TextDecoder().decode(splitted[0]);
  const name = new TextDecoder().decode(splitted[1]);
  const type = new TextDecoder().decode(splitted[2]);

  return {
    from,
    file: new File([new Blob([splitted[3]])], name, { type })
  }
}