package devapp.upt;

/**
 * Minimal Awards implementation mapping to Awards table.
 */
public class Edu_Awards {

    private final String name;
    private final String description;
    private final long points;
    private final String type;
    private final String triggerCondition;
    private final Edu_Teacher teacher;

    public Edu_Awards(String name, String description, long points, String type, String triggerCondition, Edu_Teacher teacher) {
        this.name = name;
        this.description = description;
        this.points = points;
        this.type = type;
        this.triggerCondition = triggerCondition;
        this.teacher = teacher;
    }

    /**
     * Returns the award name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the award description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns the points value for this award.
     *
     * @return the points
     */
    public long getPoints() {
        return points;
    }

    /**
     * Returns the award type identifier.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Returns the trigger condition description for awarding.
     *
     * @return the trigger condition
     */
    public String getTriggerCondition() {
        return triggerCondition;
    }

    /**
     * Returns the teacher who created/assigned the award.
     *
     * @return the teacher
     */
    public Edu_Teacher getTeacher() {
        return teacher;
    }

    @Override
    public String toString() {
        return "Edu_Awards{" + "name='" + name + '\'' + ", points=" + points + '}';
    }
}
