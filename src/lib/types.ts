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

export type NameAndClassroom = { name: string; classroom: string };
export type CoursesMap = Map<string, NameAndClassroom>;
