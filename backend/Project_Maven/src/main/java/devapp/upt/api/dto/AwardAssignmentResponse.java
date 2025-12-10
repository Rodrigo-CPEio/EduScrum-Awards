package devapp.upt.api.dto;

import devapp.upt.Edu_AwardsAssigment;

public class AwardAssignmentResponse {

    public String awardName;
    public String teacherEmail;
    public String studentEmail;
    public String teamName;
    public String reason;
    public String date;

    public AwardAssignmentResponse(Edu_AwardsAssigment a) {
        this.awardName = a.getAward().getName();
        this.teacherEmail = a.getTeacher().getEmail();
        this.studentEmail = (a.getStudent() != null) ? a.getStudent().getEmail() : null;
        this.teamName = (a.getTeam() != null) ? a.getTeam().getName() : null;
        this.reason = a.getReason();
        this.date = a.getDate().toString();
    }
}