import { openDB, deleteDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type { Course, CoursesMap, NameAndClassroom } from "./types";

export interface TsukuBashoDB extends DBSchema {
  list_of_courses: {
    key: string; // Course Number
    value: Course;
    indexes: { name: string };
  };
  meta: {
    key: string;
    value: string;
  };
}

// Excelデータの列番号と内容の対応
const dataColumn = {
  number: 0,
  name: 1,
  credits: 3,
  standard_registration_year: 4,
  term: 5,
  meeting_days_period_etc: 6,
  classroom: 7,
  instructor: 8
} as const satisfies { [column in keyof Course]: number };

const getKeys = <T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
  return Object.keys(obj);
};

export const createIdb = async (dbName: string) => {
  if (!navigator.storage || !navigator.storage.estimate) {
    console.error("使えません！");
  }

  const databases = await window.indexedDB.databases();
  const targetDb = databases.filter((db) => db.name === dbName);
  const version =
    targetDb.length > 0 && targetDb[0].version ? targetDb[0].version + 1 : 1;
  const db = await openDB<TsukuBashoDB>(dbName, version, {
    upgrade(db) {
      const syllabus = db.createObjectStore("list_of_courses", {
        keyPath: "number"
      });
      syllabus.createIndex("name", "name", { unique: false });

      db.createObjectStore("meta");
    }
  });

  const date = new Date().toJSON();
  await db.put("meta", date, "created_at");
};

export const deleteIdb = async (dbName: string) => {
  await deleteDB(dbName);
  console.log("完了しました");
};

export const registerCourses = async (
  dbName: string,
  data: string[][],
  firstRowNumber?: number
) => {
  const db = await openDB<TsukuBashoDB>(dbName);
  const date = new Date().toJSON();
  await db.put("meta", date, "updated_at");

  const tx = db.transaction("list_of_courses", "readwrite");
  const rows: Promise<string>[] = [];
  data.forEach((row, i) => {
    if (firstRowNumber ? i <= firstRowNumber : i <= 0) {
      // firstRowNumber以下の行は無視（firstRowNumberが設定されていなければ1行目を無視）
      return;
    }

    if (row[dataColumn.number].startsWith("0")) {
      // 番号が0から始まる科目はスキップ
      return;
    }

    const record = getKeys(dataColumn).map((key) => {
      return [key, String(row[dataColumn[key]])];
    });

    rows.push(tx.store.add(Object.fromEntries(record)));
  });
  const result = await Promise.all([...rows, tx.done]);
  console.log(result);
};

export const getCourseFromNumber = async (
  db: IDBPDatabase<TsukuBashoDB>,
  courseNumber: string
): Promise<Course | undefined> => {
  const course = await db.get("list_of_courses", courseNumber);
  return course;
};

export const getCoursesMap = async (
  db: IDBPDatabase<TsukuBashoDB>
): Promise<CoursesMap> => {
  const rawCourses = await db.getAll("list_of_courses");
  const courses = new Map<string, NameAndClassroom>();
  rawCourses.forEach((row) => {
    courses.set(row.number, { name: row.name, classroom: row.classroom });
  });
  return courses;
};
