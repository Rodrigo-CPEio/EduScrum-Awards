package devapp.upt;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class EduCourseProjectsUnmodifiableTest {

    @Test
    void getProjectsShouldReturnUnmodifiableList() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Project project = new Edu_Project("P1", course);
        course.addProject(project);

        // Act
        List<Edu_Project> projects = course.getProjects();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> projects.add(project));
    }
}