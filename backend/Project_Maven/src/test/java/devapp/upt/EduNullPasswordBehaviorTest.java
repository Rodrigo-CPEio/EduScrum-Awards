package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduNullPasswordBehaviorTest {

    @Test
    public void testNullPasswordBehavior() {
        Edu_User u = new Edu_User("x@x.com", null, "X");
        assertNull(u.getPasswordHash());
        assertTrue(u.verifyPassword(null));

        u.setPassword("a");
        assertTrue(u.verifyPassword("a"));
        u.setPassword(null);
        assertNull(u.getPasswordHash());
        assertTrue(u.verifyPassword(null));
    }
}
