package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduCourseEnrollStudentTest {

    @Test
    void enrollStudentShouldAddWhenNotNull() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Student student = new Edu_Student();

        course.enrollStudent(student);

        assertTrue(course.getStudents().contains(student));
    }

    @Test
    void enrollStudentShouldIgnoreNull() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);

        course.enrollStudent(null);

        assertTrue(course.getStudents().isEmpty());
    }

    @Test
    void enrollStudentShouldNotAllowDuplicateStudent() {
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Student student = new Edu_Student();

        course.enrollStudent(student);

        assertThrows(
                IllegalArgumentException.class,
                () -> course.enrollStudent(student)
        );
    }
}