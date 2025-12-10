package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduTeacherCreateCourseTest {

    @Test
    void createCourseShouldAddCourseToTeacherCourses() {
        Edu_Teacher teacher = new Edu_Teacher();

        Edu_Course course = teacher.createCourse("SQ", "Software Quality");

        assertNotNull(course);
        assertEquals("SQ", course.getName());
        assertEquals(teacher, course.getTeacher());
        assertTrue(teacher.getCourses().contains(course));
    }

    @Test
    void createCourseShouldNotAllowDuplicateCourseNames() {
        Edu_Teacher teacher = new Edu_Teacher();

        teacher.createCourse("SQ", "Software Quality");

        assertThrows(
                IllegalArgumentException.class,
                () -> teacher.createCourse("SQ", "Software Quality")
        );
    }
}