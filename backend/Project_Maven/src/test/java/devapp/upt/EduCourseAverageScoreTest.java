package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduCourseAverageScoreTest {

    @Test
    void getAverageScoreOfStudentsShouldComputeAverageScore() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);

        Edu_Student s1 = new Edu_Student();
        Edu_Student s2 = new Edu_Student();

        course.enrollStudent(s1);
        course.enrollStudent(s2);

        Edu_Awards a = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);

        s1.addAward(new Edu_AwardsAssigment(a, teacher, s1, null, LocalDateTime.now(), "R1")); // 10
        s2.addAward(new Edu_AwardsAssigment(a, teacher, s2, null, LocalDateTime.now(), "R2")); // 10
        s2.addAward(new Edu_AwardsAssigment(a, teacher, s2, null, LocalDateTime.now(), "R3")); // 20

        // Act
        double average = course.getAverageScoreOfStudents();

        // Assert
        assertEquals(15.0, average);
    }

    @Test
    void getAverageScoreOfStudentsShouldReturnZeroWhenNoStudents() {
        // Arrange
        Edu_Course course = new Edu_Course("C1", "desc", new Edu_Teacher());

        // Act & Assert
        assertEquals(0.0, course.getAverageScoreOfStudents());
    }
}