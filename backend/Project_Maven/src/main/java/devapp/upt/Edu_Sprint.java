package devapp.upt;

import java.time.LocalDateTime;

/**
 * Minimal Sprint implementation mapping to Sprint table: start/end dates,
 * objectives and parent project.
 */
public class Edu_Sprint {

    private final LocalDateTime startDate;
    private final LocalDateTime endDate;
    private final String objectives;
    private final Edu_Project project;

    public Edu_Sprint(LocalDateTime startDate, LocalDateTime endDate, String objectives, Edu_Project project) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.objectives = objectives;
        this.project = project;
    }

    /**
     * Returns the sprint start date/time.
     *
     * @return the sprint start date/time
     */
    public LocalDateTime getStartDate() {
        return startDate;
    }

    /**
     * Returns the sprint end date/time.
     *
     * @return the sprint end date/time
     */
    public LocalDateTime getEndDate() {
        return endDate;
    }

    /**
     * Returns the sprint objectives description.
     *
     * @return the objectives
     */
    public String getObjectives() {
        return objectives;
    }

    /**
     * Returns the parent project for this sprint.
     *
     * @return the project
     */
    public Edu_Project getProject() {
        return project;
    }
}
