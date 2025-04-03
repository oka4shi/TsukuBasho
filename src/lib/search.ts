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
