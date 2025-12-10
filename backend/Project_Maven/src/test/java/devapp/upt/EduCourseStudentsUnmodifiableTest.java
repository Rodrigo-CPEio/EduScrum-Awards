package devapp.upt;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduCourseStudentsUnmodifiableTest {

    @Test
    void getStudentsShouldReturnUnmodifiableList() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Student student = new Edu_Student();
        course.enrollStudent(student);

        // Act
        List<Edu_Student> students = course.getStudents();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> students.add(student));
    }
}
