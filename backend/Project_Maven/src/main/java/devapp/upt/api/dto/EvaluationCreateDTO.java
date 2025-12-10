package devapp.upt.api.dto;

public class EvaluationCreateDTO {
    public String teacherEmail;
    public String teamName;
    public int sprintIndex; // index in project.getSprints()
    public String metric;
    public String value;
}