package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduStudentCreateTeamTest {

    @Test
    void createTeamShouldCreateTeamAddToProjectAndAddStudentAsDeveloper() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("SQ", "desc", teacher);
        Edu_Project project = new Edu_Project("Proj", course);
        Edu_Student student = new Edu_Student();

        // Act
        Edu_Team team = student.createTeam(project, "New Team");

        // Assert
        assertNotNull(team);
        assertEquals("New Team", team.getName());
        assertTrue(project.getTeams().contains(team));
        assertEquals(1, team.getMembers().size());
        assertSame(student, team.getMembers().get(0).getStudent());
        assertEquals("DEVELOPER", team.getMembers().get(0).getRole());
        assertTrue(student.getTeams().contains(team));
    }

    @Test
    void createTeamShouldThrowOnNullProjectOrBlankName() {
        // Arrange
        Edu_Student student = new Edu_Student();
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));

        // Act & Assert
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> student.createTeam(null, "T1"));
        assertNotNull(ex1);

        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> student.createTeam(project, null));
        assertNotNull(ex2);

        IllegalArgumentException ex3 = assertThrows(IllegalArgumentException.class, () -> student.createTeam(project, "  "));
        assertNotNull(ex3);
    }
}