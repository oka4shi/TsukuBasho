export type Course = {
  number: string;
  name: string;
  instructional_type: string;
  credits: string;
  standard_registration_year: string;
  term: string;
  meeting_days_period_etc: string;
  classroom: string;
  instructor: string;
  remarks: string;
};

export type NameAndClassroom = { name: string; classroom: string };
export type CoursesMap = Map<string, NameAndClassroom>;
