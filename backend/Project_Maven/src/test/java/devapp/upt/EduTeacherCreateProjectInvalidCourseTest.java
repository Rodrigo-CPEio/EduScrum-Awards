package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduTeacherCreateProjectInvalidCourseTest {

    @Test
    void createProjectShouldThrowWhenCourseNotManagedByTeacher() {
        // Arrange
        Edu_Teacher teacher1 = new Edu_Teacher();
        Edu_Teacher teacher2 = new Edu_Teacher();
        Edu_Course courseNotManaged = new Edu_Course("Other", "desc", teacher2);

        // Act & Assert
        assertThrows(IllegalArgumentException.class,
                () -> teacher1.createProject(courseNotManaged, "Proj"));
    }
}