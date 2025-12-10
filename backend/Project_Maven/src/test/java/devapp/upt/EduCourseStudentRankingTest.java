package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduCourseStudentRankingTest {

    @Test
    void getStudentRankingShouldOrderByScoreDescending() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);

        Edu_Student low = new Edu_Student();
        Edu_Student high = new Edu_Student();

        course.enrollStudent(low);
        course.enrollStudent(high);

        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);

        low.addAward(new Edu_AwardsAssigment(award, teacher, low, null, LocalDateTime.now(), "R1")); // 10
        high.addAward(new Edu_AwardsAssigment(award, teacher, high, null, LocalDateTime.now(), "R2")); // 10
        high.addAward(new Edu_AwardsAssigment(award, teacher, high, null, LocalDateTime.now(), "R3")); // 20

        // Act
        List<Edu_Student> ranking = course.getStudentRanking();

        // Assert
        assertEquals(high, ranking.get(0));
        assertEquals(low, ranking.get(1));
    }
}