package devapp.upt;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

public class EduTeacherDefineTeamAssignRoleTest {

    private Edu_Teacher teacher;

    @BeforeEach
    public void setup() {
        teacher = new Edu_Teacher();
    }

    @Test
    public void testDefineTeamAndAssignRole() {
        Edu_Course course = teacher.createCourse("SQ2", "desc");
        Edu_Project project = teacher.createProject(course, "Project B");
        Edu_Team team = teacher.defineTeam(project, "Team 1");
        assertNotNull(team);
        assertEquals("Team 1", team.getName());
        assertEquals(project, team.getProject());
        assertTrue(project.getTeams().contains(team));

        Edu_Student student = new Edu_Student();
        teacher.assignRole(team, student, "Developer");
        List<Edu_TeamMember> members = team.getMembers();
        assertEquals(1, members.size());
        Edu_TeamMember tm = members.get(0);
        assertEquals(student, tm.getStudent());
        assertEquals("Developer", tm.getRole());
    }
}
