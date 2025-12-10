package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduCourseAddProjectTest {

    @Test
    void addProjectShouldAddWhenNotNull() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Project project = new Edu_Project("P1", course);

        course.addProject(project);

        assertTrue(course.getProjects().contains(project));
    }

    @Test
    void addProjectShouldIgnoreNull() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);

        course.addProject(null);

        assertTrue(course.getProjects().isEmpty());
    }

    @Test
    void addProjectShouldNotAllowDuplicateProject() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Project project = new Edu_Project("P1", course);

        course.addProject(project);

        assertThrows(
                IllegalArgumentException.class,
                () -> course.addProject(project)
        );
    }
}