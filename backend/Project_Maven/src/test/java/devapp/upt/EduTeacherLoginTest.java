package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class EduTeacherLoginTest {

    @Test
    void loginShouldSucceedWithCorrectCredentials() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        teacher.register("teach@example.com", "secret123", "Teacher One");

        // Act
        boolean result = teacher.login("teach@example.com", "secret123");

        // Assert
        assertTrue(result, "Login should succeed with correct credentials");
    }

    @Test
    void loginShouldFailWithWrongPassword() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        teacher.register("teach@example.com", "secret123", "Teacher One");

        // Act
        boolean result = teacher.login("teach@example.com", "wrongpass");

        // Assert
        assertFalse(result, "Login should fail when password is incorrect");
    }

    @Test
    void loginShouldFailWithWrongEmail() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        teacher.register("teach@example.com", "secret123", "Teacher One");

        // Act
        boolean result = teacher.login("wrong@example.com", "secret123");

        // Assert
        assertFalse(result, "Login should fail when email does not match");
    }
}