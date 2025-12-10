package devapp.upt.api.dto;

import devapp.upt.Edu_Team;

public class TeamRankingDTO {

    private String teamName;
    private long totalScore;

    public TeamRankingDTO(Edu_Team t) {
        this.teamName = t.getName();
        this.totalScore = t.getTotalScore();
    }

    public String getTeamName() {
        return teamName;
    }

    public long getTotalScore() {
        return totalScore;
    }
}