package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherAssignAwardToStudentTest {

    @Test
    void assignAwardToStudentShouldCreateAssignmentAndUpdateStudentHistory() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Student student = new Edu_Student();
        Edu_Awards award = new Edu_Awards("Bonus", "Desc", 10, "MANUAL", "none", teacher);

        // Act
        Edu_AwardsAssigment assignment = teacher.assignAwardToStudent(award, student, "Great job");

        // Assert
        assertNotNull(assignment);
        assertEquals(award, assignment.getAward());
        assertEquals(teacher, assignment.getTeacher());
        assertEquals(student, assignment.getStudent());
        assertNull(assignment.getTeam());
        assertNotNull(assignment.getDate());
        assertEquals("Great job", assignment.getReason());
        assertTrue(student.getAwardHistory().contains(assignment));
    }
}