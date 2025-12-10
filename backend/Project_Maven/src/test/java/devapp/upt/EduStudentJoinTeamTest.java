package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduStudentJoinTeamTest {

    @Test
    void joinTeamShouldAddTeamAndCreateDefaultRole() {
        // Arrange
        Edu_Student student = new Edu_Student();
        Edu_Team team = new Edu_Team("Alpha");

        // Act
        student.joinTeam(team);

        // Assert
        assertTrue(student.getTeams().contains(team),
                "Team should be added to student's team list");

        assertEquals(1, team.getMembers().size(),
                "Team should have exactly one new member");

        Edu_TeamMember member = team.getMembers().get(0);
        assertEquals(student, member.getStudent(),
                "Student must be added as team member");

        assertEquals("DEVELOPER", member.getRole(),
                "Default role should be 'DEVELOPER'");
    }

    @Test
    void joinTeamShouldNotAddNullTeam() {
        // Arrange
        Edu_Student student = new Edu_Student();

        // Act + Assert
        assertDoesNotThrow(() -> student.joinTeam(null));

        assertTrue(student.getTeams().isEmpty(),
                "Null team must not be added");
    }

    @Test
    void joinTeamShouldNotAddSameTeamTwice() {
        // Arrange
        Edu_Student student = new Edu_Student();
        Edu_Team team = new Edu_Team("Alpha");

        // Act
        student.joinTeam(team);

        // Assert (expect exception on second join)
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> student.joinTeam(team)
        );

        assertEquals("Student already in this team", ex.getMessage());

        // State must still be consistent
        assertEquals(1, student.getTeams().size(),
                "Team should not be added twice");

        assertEquals(1, team.getMembers().size(),
                "Member should not be added twice to team");
    }
}