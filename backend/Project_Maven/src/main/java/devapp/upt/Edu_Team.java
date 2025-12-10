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
    private final List<Edu_TeamMember> members = new ArrayList<>();
    private final List<Edu_AwardsAssigment> awards = new ArrayList<>();

    public Edu_Team(String name, Edu_Project project) {
        this.name = name;
        this.project = project;
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
     * Adds a member to the team with an optional role.
     * @param student the student to add
     * @param roleEnum the role enum (can be null)
     * @throws IllegalArgumentException if the student is already a member of the team
     * or if the role is already assigned (except for DEVELOPER)
     *
     */
    public void addMember(Edu_Student student, Edu_TeamMember.Role roleEnum) {
        if (student == null) {
            return;
        }

        // PREVENT DUPLICATED STUDENT IN TEAM
        boolean exists = members.stream()
                .anyMatch(m -> m.getStudent().equals(student));

        if (exists) {
            throw new IllegalArgumentException("Student already belongs to this team");
        }

        // OPTIONAL: role uniqueness (recommended)
        if (roleEnum != null) {
            boolean roleTaken = members.stream()
                    .anyMatch(m -> roleEnum == m.getRoleEnum());

            if (roleTaken && roleEnum != Edu_TeamMember.Role.DEVELOPER) {
                throw new IllegalArgumentException("Role " + roleEnum + " is already assigned in this team");
            }
        }

        members.add(new Edu_TeamMember(this, student, roleEnum));
    }

    public void addAward(Edu_AwardsAssigment award) {
        if (award != null) {
            awards.add(award);
        }
    }

    public List<Edu_AwardsAssigment> getAwardHistory() {
        return Collections.unmodifiableList(awards);
    }

    public long getTotalScore() {
        return awards.stream()
                .mapToLong(a -> a.getAward().getPoints())
                .sum();
    }

    public boolean hasScrumCoreRoles() {
        boolean sm = false, po = false, dev = false;

        for (Edu_TeamMember member : members) {

            // Mantém compatibilidade com Strings
            if (member.getRole() == null) {
                continue;
            }

            Edu_TeamMember.Role enumRole = member.getRoleEnum();

            if (enumRole != null) {
                switch (enumRole) {
                    case SCRUM_MASTER ->
                        sm = true;
                    case PRODUCT_OWNER ->
                        po = true;
                    case DEVELOPER ->
                        dev = true;
                }
            }
        }

        return sm && po && dev;
    }

    public void setProject(Edu_Project project) {
        this.project = project;
    }
}
