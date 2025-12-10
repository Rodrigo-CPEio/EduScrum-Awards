package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherRegisterTest {

    @Test
    void registerShouldSetFieldsAndReturnTrue() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();

        // Act
        boolean result = teacher.register("t@example.com", "tpass", "Teacher One");

        // Assert
        assertTrue(result);
        assertEquals("t@example.com", teacher.getEmail());
        assertEquals("Teacher One", teacher.getName());
        assertTrue(teacher.verifyPassword("tpass"));
    }
}