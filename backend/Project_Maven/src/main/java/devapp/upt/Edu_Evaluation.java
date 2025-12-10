package devapp.upt;

/**
 * Minimal Evaluation mapping to the Evaluation table.
 */
public class Edu_Evaluation {

    private final Edu_Sprint sprint;
    private final Edu_Team team;
    private final String metric;
    private final String value;

    public Edu_Evaluation(Edu_Sprint sprint, Edu_Team team, String metric, String value) {
        this.sprint = sprint;
        this.team = team;
        this.metric = metric;
        this.value = value;
    }

    /**
     * Returns the sprint associated with this evaluation.
     *
     * @return the sprint
     */
    public Edu_Sprint getSprint() {
        return sprint;
    }

    /**
     * Returns the team being evaluated.
     *
     * @return the team
     */
    public Edu_Team getTeam() {
        return team;
    }

    /**
     * Returns the metric name for this evaluation.
     *
     * @return the metric
     */
    public String getMetric() {
        return metric;
    }

    /**
     * Returns the metric value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }
}
