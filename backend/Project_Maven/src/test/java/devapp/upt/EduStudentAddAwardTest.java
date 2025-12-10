package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertSame;

public class EduStudentAddAwardTest {

    @Test
    void addAwardShouldStoreAwardInHistory() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Student student = new Edu_Student();
        Edu_Awards award = new Edu_Awards("Bonus", "Good job", 10, "MANUAL", "none", teacher);
        Edu_AwardsAssigment assignment = new Edu_AwardsAssigment(
                award, teacher, student, null, LocalDateTime.now(), "Reason");

        // Act
        student.addAward(assignment);

        // Assert
        assertEquals(1, student.getAwardHistory().size());
        assertSame(assignment, student.getAwardHistory().get(0));
    }

    @Test
    void addAwardShouldIgnoreNull() {
        // Arrange
        Edu_Student student = new Edu_Student();

        // Act
        student.addAward(null);

        // Assert
        assertTrue(student.getAwardHistory().isEmpty());
    }
}
