package devapp.upt;

/**
 * Represents a team member entry linking a student to a team with a role.
 */
public class Edu_TeamMember {

    private final Edu_Team team;
    private final Edu_Student student;
    private final String role;

    public enum Role {
    SCRUM_MASTER,
    PRODUCT_OWNER,
    DEVELOPER
    }

    public Edu_TeamMember(Edu_Team team, Edu_Student student, String role) {
        this.team = team;
        this.student = student;
        this.role = role;
    }

    /**
     * Constructs a new Edu_TeamMember with Role enum.
     * @param team the team
     * @param student the student
     * @param roleEnum the role enum
     */
    public Edu_TeamMember(Edu_Team team, Edu_Student student, Role roleEnum) {
        this.team = team;
        this.student = student;
        this.role = roleEnum != null ? roleEnum.name() : null;
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

    /**
     * Returns the role as an enum value.
     * @return the role enum or null
     */
    public Role getRoleEnum() {
        if (role == null) return null;
        
        // Try direct enum name match first
        try {
            return Role.valueOf(role);
        } catch (IllegalArgumentException e) {
            // Fall back to string matching for legacy support
            String r = role.toLowerCase();
            if (r.contains("scrum master")) return Role.SCRUM_MASTER;
            if (r.contains("product owner")) return Role.PRODUCT_OWNER;
            if (r.contains("developer")) return Role.DEVELOPER;
            return null;
        }
    }
}
