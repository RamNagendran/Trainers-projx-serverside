interface LoginCredentials {
    userEmailId: string;
    password: string;
}

interface NewCourseDetails {
    courseName: string;
    createdBy_updatedBy: string;
    createdAt_updatedAt: string;
    description: string;
    courseDuration: string;
}

interface EditCourseDetails {
    courseName: string;
    courseDuration: string;
    description: string;
}

interface NewTaskDetails {
    course_id: string;
    taskName: string;
    taskDescription: string;
    createdBy_updatedBy: string;
    createdAt_updatedAt: string;
    languageType: string;
    solution: string;
    imageList: any;
}

interface BatchDetails {
    batchUniqueId?: string;
    userId?: string;
    batchName: string;
    startDate: string;
    timings: string;
    courseId: string;
    students: any;
}
interface StatusDetails {
    batchId?: string;
    status: string;
}
interface EditedTask {
    taskName: string;
    taskDescription: string;
    solutions: string
    languageType: string;
}