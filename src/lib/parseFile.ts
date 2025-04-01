import * as xlsx from "xlsx";
import { createIdb, registerCourses, getCourseFromNumber } from "./idb";

export const parseXlsxFile = async (data: ArrayBuffer) => {
  const workbook = xlsx.read(data);
  console.log("start parsing");
  const sheetNames = workbook.SheetNames;
  console.log(sheetNames);

  if (!sheetNames.includes("開設科目一覧")) {
    console.error("エラー！");
  }

  const sheet = workbook.Sheets[sheetNames[0]];
  const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(rawData[0]);

  await createIdb("TsukuBasho");
  await registerCourses("TsukuBasho", rawData);
  await getCourseFromNumber("TsukuBasho", "GE11212");
};
