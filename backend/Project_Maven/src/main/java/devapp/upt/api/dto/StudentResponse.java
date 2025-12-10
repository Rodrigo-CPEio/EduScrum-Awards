package devapp.upt.api.dto;

import devapp.upt.Edu_Student;

public class StudentResponse {

    private String email;
    private String name;
    private long totalScore;

    public StudentResponse(Edu_Student s) {
        this.email = s.getEmail();
        this.name = s.getName();
        this.totalScore = s.getTotalScore();
    }

    public String getEmail() { return email; }
    public String getName() { return name; }
    public long getTotalScore() { return totalScore; }
}