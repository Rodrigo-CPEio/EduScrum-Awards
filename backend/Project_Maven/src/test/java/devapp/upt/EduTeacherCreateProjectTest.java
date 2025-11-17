package devapp.upt;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EduTeacherCreateProjectTest {

    private Edu_Teacher teacher;

    @BeforeEach
    public void setup() {
        teacher = new Edu_Teacher();
    }

    @Test
    public void testCreateProject() {
        Edu_Course course = teacher.createCourse("SQ", "desc");
        Edu_Project project = teacher.createProject(course, "Project A");
        assertNotNull(project);
        assertEquals("Project A", project.getName());
        assertEquals(course, project.getCourse());
        assertTrue(course.getProjects().contains(project));
    }
}
