package devapp.upt;

/**
 * Represents a team member entry linking a student to a team with a role.
 */
public class Edu_TeamMember {

    private final Edu_Team team;
    private final Edu_Student student;
    private final String role;

    public Edu_TeamMember(Edu_Team team, Edu_Student student, String role) {
        this.team = team;
        this.student = student;
        this.role = role;
    }

	/**
	 * Constructs a new Edu_TeamMember.
	 * @param role
	 * @param student
	 * @param team
	 */
    public Edu_TeamMember(String role, Edu_Student student, Edu_Team team) {
        this.role = role;
        this.student = student;
        this.team = team;
    }

    /**
     * Returns the team this entry belongs to.
     *
     * @return the team
     */
    public Edu_Team getTeam() {
        return team;
    }

    /**
     * Returns the student linked to this entry.
     *
     * @return the student
     */
    public Edu_Student getStudent() {
        return student;
    }

    /**
     * Returns the role assigned to the student in the team.
     *
     * @return the role
     */
    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return "Edu_TeamMember{" + "student=" + (student != null ? student.getName() : "null") + ", role='" + role + '\'' + '}';
    }
}
