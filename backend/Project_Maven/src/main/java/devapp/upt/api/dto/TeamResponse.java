package devapp.upt.api.dto;

import devapp.upt.Edu_Team;

public class TeamResponse {

    private String name;
    private String projectName;
    private int membersCount;
    private long totalScore;
    private boolean hasScrumCoreRoles;

    public TeamResponse(Edu_Team t) {
        this.name = t.getName();
        this.projectName = t.getProject() != null ? t.getProject().getName() : null;
        this.membersCount = t.getMembers().size();
        this.totalScore = t.getTotalScore();
        this.hasScrumCoreRoles = t.hasScrumCoreRoles();
    }

    public String getName() { return name; }
    public String getProjectName() { return projectName; }
    public int getMembersCount() { return membersCount; }
    public long getTotalScore() { return totalScore; }
    public boolean isHasScrumCoreRoles() { return hasScrumCoreRoles; }
}