package devapp.upt.api.dto;

import devapp.upt.Edu_Project;

public class ProjectResponse {

    private String name;
    private String courseName;
    private int teamCount;
    private int sprintCount;
    private double averageEvaluation;

    public ProjectResponse(Edu_Project p) {
        this.name = p.getName();
        this.courseName = p.getCourse() != null ? p.getCourse().getName() : null;
        this.teamCount = p.getTeams().size();
        this.sprintCount = p.getSprints().size();
        this.averageEvaluation = p.calculateAverageEvaluationValue();
    }

    public String getName() { return name; }
    public String getCourseName() { return courseName; }
    public int getTeamCount() { return teamCount; }
    public int getSprintCount() { return sprintCount; }
    public double getAverageEvaluation() { return averageEvaluation; }
}