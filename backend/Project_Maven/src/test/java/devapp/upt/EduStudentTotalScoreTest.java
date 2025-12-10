package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduStudentTotalScoreTest {

    @Test
    void getTotalScoreShouldSumAllAwardPoints() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Student student = new Edu_Student();

        Edu_Awards a1 = new Edu_Awards("A1", "D1", 10, "MANUAL", "none", teacher);
        Edu_Awards a2 = new Edu_Awards("A2", "D2", 20, "MANUAL", "none", teacher);

        student.addAward(new Edu_AwardsAssigment(a1, teacher, student, null, LocalDateTime.now(), "R1"));
        student.addAward(new Edu_AwardsAssigment(a2, teacher, student, null, LocalDateTime.now(), "R2"));

        // Act
        long total = student.getTotalScore();

        // Assert
        assertEquals(30L, total);
    }

    @Test
    void getTotalScoreShouldBeZeroWhenNoAwards() {
        // Arrange
        Edu_Student student = new Edu_Student();

        // Act & Assert
        assertEquals(0L, student.getTotalScore());
    }
}