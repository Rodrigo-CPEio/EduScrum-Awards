package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduUserHashingTest {

    @Test
    public void testPasswordHashAndVerify_User() {
        Edu_User u = new Edu_User("u@example.com", "secret123", "User One");

        assertNotNull(u.getPasswordHash());
        assertNotEquals("secret123", u.getPasswordHash());
        assertTrue(u.verifyPassword("secret123"));
        assertFalse(u.verifyPassword("wrong"));

        u.setPassword("newpass");
        assertTrue(u.verifyPassword("newpass"));
        assertFalse(u.verifyPassword("secret123"));
    }
}
