package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduStudentCompareWithCourseAverageTest {

    @Test
    void compareWithCourseAverageShouldReturnDeltaToAverage() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("SQ", "desc", teacher);

        Edu_Student s1 = new Edu_Student();
        Edu_Student s2 = new Edu_Student();

        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);

        s1.addAward(new Edu_AwardsAssigment(award, teacher, s1, null, LocalDateTime.now(), "R1")); // 10
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R2")); // 10
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R3")); // 20 total

        course.enrollStudent(s1);
        course.enrollStudent(s2);

        // average = (10 + 20) / 2 = 15
        // s1 delta = 10 - 15 = -5
        // s2 delta = 20 - 15 = 5

        // Act
        double delta1 = s1.compareWithCourseAverage(course);
        double delta2 = s2.compareWithCourseAverage(course);

        // Assert
        assertEquals(-5.0, delta1);
        assertEquals(5.0, delta2);
    }

    @Test
    void compareWithCourseAverageShouldReturnZeroIfCourseNullOrNoStudents() {
        // Arrange
        Edu_Student student = new Edu_Student();
        Edu_Course emptyCourse = new Edu_Course("Empty", "desc", new Edu_Teacher());

        // Act & Assert
        assertEquals(0.0, student.compareWithCourseAverage(null));
        assertEquals(0.0, student.compareWithCourseAverage(emptyCourse));
    }
}
