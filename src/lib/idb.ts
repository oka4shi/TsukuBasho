import { openDB, deleteDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

export type Course = {
  number: string;
  name: string;
  credits: string;
  standard_registration_year: string;
  term: string;
  meeting_days_period_etc: string;
  classroom: string;
  instructor: string;
};

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

  const db = await openDB<TsukuBashoDB>(dbName, 1, {
    upgrade(db) {
      const syllabus = db.createObjectStore("list_of_courses", {
        keyPath: "number"
      });
      syllabus.createIndex("name", "name", { unique: false });

      db.createObjectStore("meta");
    }
  });

  await db.put("meta", "2025-04-01T09:01:30Z", "created_at");
};

export const deleteIdb = async (dbName: string) => {
  await deleteDB(dbName);
  console.log("完了しました");
};

export const registerCourses = async (dbName: string, data: string[][]) => {
  const db = await openDB<TsukuBashoDB>(dbName);
  await db.put("meta", "2025-04-01T9:16:00Z", "updated_at");

  const tx = db.transaction("list_of_courses", "readwrite");
  const rows = data.map((row) => {
    const record = getKeys(dataColumn).map((key) => {
      return [key, String(row[dataColumn[key]])];
    });

    return tx.store.add(Object.fromEntries(record));
  });
  const result = await Promise.all([...rows, tx.done]);
  console.log(result);
};

export const getCourseFromNumber = async (
  db: IDBPDatabase<TsukuBashoDB>,
  courseNumber: string
): Promise<Course | undefined> => {
  const course = await db.get("list_of_courses", courseNumber);
  console.log(course);
  return course;
};

export const getCoursesMap = async (
  db: IDBPDatabase<TsukuBashoDB>
): Promise<Map<string, string>> => {
  const rawCourses = await db.getAll("list_of_courses");
  const courses = new Map<string, string>();
  rawCourses.forEach((row) => {
    courses.set(row.number, row.name);
  });
  return courses;
};

export const searchCoursesFromName = async (
  db: IDBPDatabase<TsukuBashoDB>,
  courses: Map<string, string>,
  courseName: string
): Promise<(Course | undefined)[]> => {
  // 部分一致検索
  let keys: string[] = [];
  for (const course of courses) {
    if (course[1].includes(courseName)) {
      keys.push(course[0]);
    }
  }

  const tx = db.transaction("list_of_courses", "readonly");
  const result = await Promise.all(
    keys.map((key) => {
      return tx.store.get(key);
    })
  );
  await tx.done;

  return result;
};
