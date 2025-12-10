package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherAssignAwardToTeamTest {

    @Test
    void assignAwardToTeamShouldCreateAssignmentAndUpdateTeamHistory() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj");
        Edu_Team team = teacher.defineTeam(project, "Team 1");
        Edu_Awards award = new Edu_Awards("Team Bonus", "Desc", 50, "MANUAL", "none", teacher);

        // Act
        Edu_AwardsAssigment assignment = teacher.assignAwardToTeam(award, team, "Team success");

        // Assert
        assertNotNull(assignment);
        assertEquals(award, assignment.getAward());
        assertEquals(team, assignment.getTeam());
        assertNull(assignment.getStudent());
        assertTrue(team.getAwardHistory().contains(assignment));
    }
}