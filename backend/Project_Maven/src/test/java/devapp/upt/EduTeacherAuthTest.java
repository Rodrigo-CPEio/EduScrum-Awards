package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduTeacherAuthTest {

    @Test
    public void testTeacherRegisterAndLogin() {
        Edu_Teacher t = new Edu_Teacher();
        // register with credentials
        assertTrue(t.register("teach@example.com", "tpass", "Teach"));
        // login should succeed
        assertTrue(t.login("teach@example.com", "tpass"));
        // wrong password fails
        assertFalse(t.login("teach@example.com", "wrong"));
    }
}
