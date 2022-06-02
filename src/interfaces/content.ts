export interface Quarter {
    id: string;
    number: string;
    title: string;
    color: string;
    createdAt: string;
}
export interface Lesson {
    id: string;
    quarterId: string;
    number: string;
    title: string;
    intro: string;
    color: string;
    createdAt: string;
}
export interface Bookmark {
    lessonId: string;
    bookmarkedAt: string;
}
export interface BookmarkItem extends Bookmark {
    lesson: Lesson;
    quarter: Quarter;
}
export interface Video {
    id: string;
    quarterId: string;
    lessonId: string;
    src: string;
    number: string;
    createdAt: string;
}
export interface Module {
    id: string;
    quarterId: string;
    lessonId: string;
    fileName: string;
    createdAt: string;
    downloadUrl: string;
}
export interface Worksheet {
    id: string;
    quarterId: string;
    lessonId: string;
    fileName: string;
    points: number;
    createdAt: string;
    downloadUrl: string;
}
export interface SubmittedWorksheet {
    id: string;
    uid: string;
    worksheetId: string;
    fileName: string;
    score: number;
    downloadUrl: string;
    createdAt: string;
}
export interface Assessment {
    id: string;
    quarterId: string;
    lessonId: string;
    title: string;
    description: string;
    createdAt: string;
}
export interface AssessmentItemChoice {
    id: string;
    label: string;
}
export interface AssessmentItem {
    id: string;
    question: string;
    image: string;
    choices: AssessmentItemChoice[];
    correctChoice: string;
    answer: string;
    order?: number;
}
export interface AssessmentResult {
    id: string;
    uid: string;
    assessmentId: string;
    score: number;
    items: AssessmentItem[];
}
