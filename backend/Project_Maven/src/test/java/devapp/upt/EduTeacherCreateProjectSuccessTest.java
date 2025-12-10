package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherCreateProjectSuccessTest {

    @Test
    void createProjectShouldCreateWhenCourseManagedByTeacher() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");

        // Act
        Edu_Project project = teacher.createProject(course, "Proj A");

        // Assert
        assertNotNull(project);
        assertEquals("Proj A", project.getName());
        assertEquals(course, project.getCourse());
        assertTrue(course.getProjects().contains(project));
    }
}