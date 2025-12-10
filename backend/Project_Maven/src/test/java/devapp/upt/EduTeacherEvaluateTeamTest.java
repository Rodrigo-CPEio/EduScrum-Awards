package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

public class EduTeacherEvaluateTeamTest {

    @Test
    void evaluateTeamShouldCreateEvaluationAndAttachToProject() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj");
        Edu_Team team = teacher.defineTeam(project, "Team 1");
        Edu_Sprint sprint = teacher.createSprint(project, LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Objectives");

        // Act
        Edu_Evaluation eval = teacher.evaluateTeam(sprint, team, "progress", "80");

        // Assert
        assertNotNull(eval);
        assertEquals(sprint, eval.getSprint());
        assertEquals(team, eval.getTeam());
        assertEquals("progress", eval.getMetric());
        assertEquals("80", eval.getValue());
        assertTrue(project.getEvaluations().contains(eval));
    }
}