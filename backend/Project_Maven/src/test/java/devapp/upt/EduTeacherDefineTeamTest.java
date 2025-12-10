package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduTeacherDefineTeamTest {

    @Test
    void defineTeamShouldCreateTeamInProject() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj A");

        // Act
        Edu_Team team = teacher.defineTeam(project, "Team 1");

        // Assert
        assertNotNull(team);
        assertEquals("Team 1", team.getName());
        assertEquals(project, team.getProject());
        assertTrue(project.getTeams().contains(team));
    }
}