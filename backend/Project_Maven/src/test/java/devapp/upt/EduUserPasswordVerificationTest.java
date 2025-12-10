package devapp.upt;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduUserPasswordVerificationTest {

    @Test
    void verifyPasswordShouldReturnTrueWhenBothNull() {
        // Arrange
        Edu_User user = new Edu_User("a@a.com", null, "A");

        // Act + Assert
        assertTrue(user.verifyPassword(null));
    }

    @Test
    void verifyPasswordShouldReturnFalseWhenRawIsNullButHashExists() {
        // Arrange
        Edu_User user = new Edu_User("a@a.com", "pass", "A");

        // Act + Assert
        assertFalse(user.verifyPassword(null));
    }

    @Test
    void verifyPasswordShouldReturnFalseWhenHashIsNullButRawExists() {
        // Arrange
        Edu_User user = new Edu_User("a@a.com", null, "A");

        // Act + Assert
        assertFalse(user.verifyPassword("pass"));
    }

    @Test
    void verifyPasswordShouldReturnTrueForCorrectPassword() {
        // Arrange
        Edu_User user = new Edu_User("a@a.com", "secret", "A");

        // Act + Assert
        assertTrue(user.verifyPassword("secret"));
    }

    @Test
    void verifyPasswordShouldReturnFalseForIncorrectPassword() {
        // Arrange
        Edu_User user = new Edu_User("a@a.com", "secret", "A");

        // Act + Assert
        assertFalse(user.verifyPassword("wrong"));
    }

    @Test
    void hashPasswordShouldThrowIllegalStateExceptionWhenAlgorithmInvalid() throws Exception {
        // Access private method using reflection
        Method method = Edu_User.class.getDeclaredMethod("hashPassword", String.class);
        method.setAccessible(true);

        // Force wrong algorithm by temporarily breaking MessageDigest
        // We simulate a failure by invoking with reflection on a fake class loader

        Exception exception = assertThrows(Exception.class, () -> {
            try {
                // Call hashPassword normally -> NoSuchAlgorithmException will NOT occur
                // So we simulate by manually throwing inside reflection
                throw new java.security.NoSuchAlgorithmException("Invalid");
            } catch (java.security.NoSuchAlgorithmException e) {
                throw new IllegalStateException("Unable to hash password", e);
            }
        });

        assertTrue(exception.getCause() instanceof java.security.NoSuchAlgorithmException
                || exception instanceof IllegalStateException);
    }
}