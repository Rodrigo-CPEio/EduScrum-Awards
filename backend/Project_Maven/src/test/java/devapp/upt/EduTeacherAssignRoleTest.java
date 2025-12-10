package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import org.junit.jupiter.api.Test;

public class EduTeacherAssignRoleTest {

    @Test
    void assignRoleShouldAddTeamMemberWithRole() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj");
        Edu_Team team = teacher.defineTeam(project, "Team 1");
        Edu_Student student = new Edu_Student();

        teacher.assignRole(team, student, "Scrum Master");

        assertEquals(1, team.getMembers().size());
        Edu_TeamMember member = team.getMembers().get(0);
        assertSame(student, member.getStudent());
        assertEquals("SCRUM_MASTER", member.getRole());
    }

    @Test
    void assignRoleShouldDefaultToDeveloperWhenRoleIsInvalid() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj");
        Edu_Team team = teacher.defineTeam(project, "Team 1");
        Edu_Student student = new Edu_Student();

        teacher.assignRole(team, student, "INVALID_ROLE");

        assertEquals(
                Edu_TeamMember.Role.DEVELOPER,
                team.getMembers().get(0).getRoleEnum()
        );
    }
}