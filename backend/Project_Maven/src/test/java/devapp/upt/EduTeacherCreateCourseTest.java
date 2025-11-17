package devapp.upt;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

public class EduTeacherCreateCourseTest {

    private Edu_Teacher teacher;

    @BeforeEach
    public void setup() {
        teacher = new Edu_Teacher();
    }

    @Test
    public void testCreateCourse() {
        Edu_Course course = teacher.createCourse("Software Quality", "Intro to SQ");
        assertNotNull(course);
        assertEquals("Software Quality", course.getName());
        assertEquals(teacher, course.getTeacher());
        List<Edu_Course> courses = teacher.getCourses();
        assertTrue(courses.contains(course));
    }
}
