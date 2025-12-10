package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduStudentAwardHistoryTest {

    @Test
    void getAwardHistoryShouldBeUnmodifiable() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Student student = new Edu_Student();
        Edu_Awards award = new Edu_Awards("Bonus", "Desc", 5, "MANUAL", "none", teacher);
        Edu_AwardsAssigment assignment = new Edu_AwardsAssigment(
                award, teacher, student, null, LocalDateTime.now(), "Reason");
        student.addAward(assignment);

        // Act
        List<Edu_AwardsAssigment> history = student.getAwardHistory();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> history.add(assignment));
    }
}