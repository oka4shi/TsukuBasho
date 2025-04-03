import * as xlsx from "xlsx";
import { createIdb, registerCourses } from "./idb";

export const parseXlsxFile = async (data: ArrayBuffer) => {
  const workbook = xlsx.read(data);
  const sheetNames = workbook.SheetNames;

  if (!sheetNames.includes("開設科目一覧")) {
    console.error("エラー！");
  }

  const sheet = workbook.Sheets[sheetNames[0]];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  const firstRow = getFirstRowNumber(rawData);
  if (firstRow === -1) {
    throw new Error("ファイルを読み込めませんでした");
  }

  await createIdb("TsukuBasho");
  await registerCourses("TsukuBasho", rawData, firstRow);
};

const getFirstRowNumber = (data: string[][]): number => {
  const limit = 10;
  for (let rowNumber = 0; rowNumber < limit; rowNumber++) {
    if (data[rowNumber][0] === "科目番号") {
      return rowNumber;
    }
  }

  return -1; // 見つからなければ -1 を返す
};
