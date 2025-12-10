package devapp.upt.api.dto;

import devapp.upt.Edu_Teacher;

public class TeacherResponse {

    private String email;
    private String name;
    private String institution;
    private int coursesCount;

    public TeacherResponse(Edu_Teacher t) {
        this.email = t.getEmail();
        this.name = t.getName();
        this.institution = t.getInstitution();
        this.coursesCount = t.getCourses().size();
    }

    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getInstitution() { return institution; }
    public int getCoursesCount() { return coursesCount; }
}
