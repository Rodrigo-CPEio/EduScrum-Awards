package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduStudentPasswordInheritanceTest {

    @Test
    public void testPasswordInheritance_Student() {
        Edu_Student s = new Edu_Student();
        // default student uses DEFAULT_PASSWORD (changeme)
        assertTrue(s.verifyPassword("changeme"));

        s.setPassword("studpass");
        assertTrue(s.verifyPassword("studpass"));
        assertFalse(s.verifyPassword("changeme"));
    }
}
