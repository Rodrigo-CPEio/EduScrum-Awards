package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduTeamAddMemberTest {

    @Test
    void addMemberShouldAddTeamMember() {
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Team team = new Edu_Team("Team", project);
        Edu_Student student = new Edu_Student();

        team.addMember(student, Edu_TeamMember.Role.DEVELOPER);

        assertEquals(1, team.getMembers().size());
        Edu_TeamMember member = team.getMembers().get(0);
        assertSame(student, member.getStudent());
        assertEquals("DEVELOPER", member.getRole());
    }

    @Test
    void addMemberShouldIgnoreNullStudent() {
        Edu_Team team = new Edu_Team("Team", null);

        team.addMember(null, Edu_TeamMember.Role.DEVELOPER);

        assertTrue(team.getMembers().isEmpty());
    }

    @Test
    void addMemberShouldNotAllowSameStudentTwice() {
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Team team = new Edu_Team("Team", project);
        Edu_Student student = new Edu_Student();

        team.addMember(student, Edu_TeamMember.Role.DEVELOPER);

        assertThrows(
                IllegalArgumentException.class,
                () -> team.addMember(student, Edu_TeamMember.Role.DEVELOPER)
        );
    }

    @Test
    void addMemberShouldNotAllowDuplicateScrumMaster() {
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Team team = new Edu_Team("Team", project);

        team.addMember(new Edu_Student(), Edu_TeamMember.Role.SCRUM_MASTER);

        assertThrows(
                IllegalArgumentException.class,
                () -> team.addMember(new Edu_Student(), Edu_TeamMember.Role.SCRUM_MASTER)
        );
    }
}