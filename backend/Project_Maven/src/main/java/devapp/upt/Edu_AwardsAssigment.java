package devapp.upt;

import java.time.LocalDateTime;

/**
 * Maps an award assignment to a student/team by a teacher.
 */
public class Edu_AwardsAssigment {

    private final Edu_Awards award;
    private final Edu_Teacher teacher;
    private final Edu_Student student;
    private final Edu_Team team;
    private final LocalDateTime date;
    private final String reason;

    public Edu_AwardsAssigment(Edu_Awards award, Edu_Teacher teacher, Edu_Student student, Edu_Team team, LocalDateTime date, String reason) {
        this.award = award;
        this.teacher = teacher;
        this.student = student;
        this.team = team;
        this.date = date;
        this.reason = reason;
    }

    /**
     * Returns the award assigned.
     *
     * @return the award
     */
    public Edu_Awards getAward() {
        return award;
    }

    /**
     * Returns the teacher who assigned the award.
     *
     * @return the teacher
     */
    public Edu_Teacher getTeacher() {
        return teacher;
    }

    /**
     * Returns the student recipient (may be null if award assigned to team).
     *
     * @return the student or null
     */
    public Edu_Student getStudent() {
        return student;
    }

    /**
     * Returns the team recipient (may be null if award assigned to student).
     *
     * @return the team or null
     */
    public Edu_Team getTeam() {
        return team;
    }

    /**
     * Returns the date/time when the award was assigned.
     *
     * @return the date/time
     */
    public LocalDateTime getDate() {
        return date;
    }

    /**
     * Returns the reason or explanation for the award.
     *
     * @return the reason
     */
    public String getReason() {
        return reason;
    }
}
