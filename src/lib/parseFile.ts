import * as xlsx from "xlsx";
import { openIdb, registerCourses } from "./idb";
import { PUBLIC_IDB_NAME } from "$env/static/public";

export const parseXlsxFile = (data: ArrayBuffer) => {
  const workbook = xlsx.read(data);
  const sheetNames = workbook.SheetNames;

  if (!sheetNames.includes("開設科目一覧")) {
    console.error("エラー！");
  }

  const sheet = workbook.Sheets[sheetNames[0]];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  return rawData;
};

export const registerCoursesFromRawData = async (
  rawData: string[][],
  excludingCourses?: string[]
) => {
  const firstRow = getFirstRowNumber(rawData);
  if (firstRow === -1) {
    throw new Error("ファイルを読み込めませんでした");
  }

  const dbName = PUBLIC_IDB_NAME || "TsukuBasho";
  const db = await openIdb(dbName);
  await registerCourses(db, rawData, firstRow, excludingCourses);
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
