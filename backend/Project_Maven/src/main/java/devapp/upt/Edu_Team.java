package devapp.upt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Minimal implementation of a Team. Holds members and allows adding members
 * with roles.
 */
public class Edu_Team {

    private final String name;
    private Edu_Project project;
    private List<Edu_TeamMember> members = new ArrayList<>();

    public Edu_Team(String name, Edu_Project project) {
        this.name = name;
        this.project = project;
        this.members = new ArrayList<>();
    }

    public Edu_Team(String name) {
        this.name = name;
    }

    /**
     * Returns the team name.
     *
     * @return the team name
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the project this team belongs to.
     *
     * @return the project
     */
    public Edu_Project getProject() {
        return project;
    }

    /**
     * Returns an unmodifiable view of team members.
     *
     * @return unmodifiable list of members
     */
    public List<Edu_TeamMember> getMembers() {
        return Collections.unmodifiableList(members);
    }

    /**
     * Adds a student to the team with the given role. Null students are
     * ignored.
     *
     * @param student the student to add
     * @param role the role assigned to the student
     */
    public void addMember(Edu_Student student, String role) {
        if (student == null) {
            return;
        }
        Edu_TeamMember tm = new Edu_TeamMember(this, student, role);
        members.add(tm);
    }

    @Override
    public String toString() {
        return "Edu_Team{" + "name='" + name + '\'' + ", members=" + members.size() + '}';
    }

    public void setProject(Edu_Project project) {
        this.project = project;
    }
}
