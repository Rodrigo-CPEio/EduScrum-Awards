package devapp.upt.api.dto;

import devapp.upt.Edu_Awards;

public class AwardResponse {

    private String name;
    private String description;
    private long points;
    private String type;
    private String triggerCondition;
    private String teacherEmail;

    public AwardResponse(Edu_Awards a) {
        this.name = a.getName();
        this.description = a.getDescription();
        this.points = a.getPoints();
        this.type = a.getType();
        this.triggerCondition = a.getTriggerCondition();
        this.teacherEmail = a.getTeacher() != null ? a.getTeacher().getEmail() : null;
    }

    public String getName() { return name; }
    public String getDescription() { return description; }
    public long getPoints() { return points; }
    public String getType() { return type; }
    public String getTriggerCondition() { return triggerCondition; }
    public String getTeacherEmail() { return teacherEmail; }
}