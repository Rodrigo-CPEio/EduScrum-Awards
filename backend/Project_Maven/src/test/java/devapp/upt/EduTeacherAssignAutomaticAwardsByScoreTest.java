package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduTeacherAssignAutomaticAwardsByScoreTest {

    @Test
    void assignAutomaticAwardsShouldOnlyAwardStudentsMeetingThreshold() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = teacher.createCourse("SQ", "desc");

        Edu_Student s1 = new Edu_Student();
        Edu_Student s2 = new Edu_Student();

        course.enrollStudent(s1);
        course.enrollStudent(s2);

        Edu_Awards award = new Edu_Awards("Auto", "Desc", 10, "AUTO", ">=10", teacher);

        // s1 gets 10 -> below threshold (15)
        s1.addAward(new Edu_AwardsAssigment(award, teacher, s1, null, LocalDateTime.now(), "R1"));
        // s2 gets 20 -> above threshold (15)
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R2"));
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R3"));

        long threshold = 15L;

        // Act
        List<Edu_AwardsAssigment> assignments =
                teacher.assignAutomaticAwardsByScore(course, award, threshold);

        // Assert
        assertEquals(1, assignments.size());
        assertEquals(s2, assignments.get(0).getStudent());
        assertTrue(s2.getAwardHistory().contains(assignments.get(0)));
    }
}