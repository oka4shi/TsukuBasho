import { parseXlsxFile } from "$lib/parseFile";

import { writable } from "svelte/store";

export const progress = writable({
  value: 0,
  text: "",
  isError: false
});

export const registerFiles = async (file: File | null) => {
  if (file === null) {
    progress.set({
      text: "ファイルがありません",
      value: 1,
      isError: true
    });

    return;
  }

  progress.set({
    text: "ファイルを変換しています……",
    value: 0.1,
    isError: false
  });

  const arrayBufferedFile = await file.arrayBuffer();

  progress.set({
    text: "Excelファイルからデータをインポートしています……",
    value: 0.5,
    isError: false
  });
  try {
    await parseXlsxFile(arrayBufferedFile);

    progress.set({
      text: "登録が完了しました！",
      value: 1,
      isError: false
    });
  } catch (error) {
    console.error(error);
    progress.set({
      text: "登録中にエラーが発生しました！",
      value: 1,
      isError: true
    });
  }
};
