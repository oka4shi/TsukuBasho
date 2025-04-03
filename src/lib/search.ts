import type { CoursesMap } from "./types";

export const searchNumberFromName = (
  courses: CoursesMap,
  courseName: string
): string[] => {
  // 部分一致検索
  const numbers: string[] = [];
  for (const course of courses) {
    if (course[1].name.includes(courseName)) {
      numbers.push(course[0]);
    }
  }

  return numbers;
};

export const completeNumber = (
  courses: CoursesMap,
  partialNumber: string
): string[] => {
  // 補完
  const numbers: string[] = [];
  for (const course of courses) {
    if (course[0].startsWith(partialNumber)) {
      numbers.push(course[0]);
    }
  }

  return numbers;
};
