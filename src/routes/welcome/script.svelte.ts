import { parseXlsxFile, registerCoursesFromRawData } from "$lib/parseFile";

import { writable } from "svelte/store";

export const progress = writable({
  value: 0,
  text: "",
  isError: false
});

export const registerFiles = async (
  file: File | null,
  excludingCourses: string[]
) => {
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
    text: "Excelファイルを解析しています……",
    value: 0.5,
    isError: false
  });
  try {
    const rawData = parseXlsxFile(arrayBufferedFile);
    progress.set({
      text: "データを保存しています……",
      value: 0.75,
      isError: false
    });
    await registerCoursesFromRawData(rawData, excludingCourses);

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
