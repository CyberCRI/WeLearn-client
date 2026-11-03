import { strFromU8, unzipSync } from 'fflate';

// unzips a generated .docx: the paths of its files and a reader for their text.
// FileReader because the Blob from jsdom has no arrayBuffer()
export const readDocx = async (blob: Blob) => {
  const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
  const files = unzipSync(new Uint8Array(bytes));

  return {
    paths: Object.keys(files),
    read: (path: string) => {
      if (!files[path]) throw new Error(`${path} is not in the .docx`);
      return strFromU8(files[path]);
    }
  };
};
