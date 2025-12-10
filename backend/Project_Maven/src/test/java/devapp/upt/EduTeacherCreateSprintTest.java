package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherCreateSprintTest {

    @Test
    void createSprintShouldAddSprintToProject() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Proj");
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(14);

        // Act
        Edu_Sprint sprint = teacher.createSprint(project, start, end, "Finish stories");

        // Assert
        assertNotNull(sprint);
        assertEquals(start, sprint.getStartDate());
        assertEquals(end, sprint.getEndDate());
        assertEquals("Finish stories", sprint.getObjectives());
        assertEquals(project, sprint.getProject());
        assertTrue(project.getSprints().contains(sprint));
    }
}