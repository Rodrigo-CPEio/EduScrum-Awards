package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduStudentRegisterTest {

    @Test
    void registerShouldSetCredentialsAndReturnTrue() {
        // Arrange
        Edu_Student student = new Edu_Student();

        // Act
        boolean result = student.register("s1@example.com", "pass123", "Student One");

        // Assert
        assertTrue(result);
        assertEquals("s1@example.com", student.getEmail());
        assertEquals("Student One", student.getName());
        assertTrue(student.verifyPassword("pass123"));
    }
}