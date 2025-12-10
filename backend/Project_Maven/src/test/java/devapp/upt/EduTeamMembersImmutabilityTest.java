package devapp.upt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EduTeamMembersImmutabilityTest {

    private Edu_Team team;
    private Edu_Project project;
    private Edu_Course course;
    private Edu_Teacher teacher;

    @BeforeEach
    public void setup() {
        teacher = new Edu_Teacher();
        course = new Edu_Course("C1", "Desc", teacher);
        project = new Edu_Project("P1", course);
        team = new Edu_Team("Team 1", project);
        team.addMember(new Edu_Student(), Edu_TeamMember.Role.DEVELOPER);
    }

    @Test
    public void shouldReturnUnmodifiableMembersList() {
        List<Edu_TeamMember> members = team.getMembers();

        UnsupportedOperationException exception = assertThrows(UnsupportedOperationException.class, () -> members.add(null));
        assertNotNull(exception);
    }
}