package devapp.upt.api.dto;

import devapp.upt.Edu_Course;

public class CourseResponse {

    private String name;
    private String description;
    private String teacherEmail;
    private int studentsCount;
    private int projectsCount;
    private double averageScore;

    public CourseResponse(Edu_Course c) {
        this.name = c.getName();
        this.description = c.getDescription();
        this.teacherEmail = c.getTeacher() != null ? c.getTeacher().getEmail() : null;
        this.studentsCount = c.getStudents().size();
        this.projectsCount = c.getProjects().size();
        this.averageScore = c.getAverageScoreOfStudents();
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getTeacherEmail() { return teacherEmail; }
    public int getStudentsCount() { return studentsCount; }
    public int getProjectsCount() { return projectsCount; }
    public double getAverageScore() { return averageScore; }
}