package devapp.upt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EduStudentLoginTest {

    private Edu_Student student;

    @BeforeEach
    public void setup() {
        student = new Edu_Student();
        student.register("stud@mail.com", "mypass", "Alex");
    }

    @Test
    public void shouldLoginSuccessfullyWithCorrectCredentials() {
        assertTrue(student.login("stud@mail.com", "mypass"));
    }

    @Test
    public void shouldFailLoginWithWrongPassword() {
        assertFalse(student.login("stud@mail.com", "wrong"));
    }

    @Test
    public void shouldFailLoginWithWrongEmail() {
        assertFalse(student.login("other@mail.com", "mypass"));
    }
}