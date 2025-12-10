package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduCourseExportStudentRankingCSVTest {

    @Test
    void exportStudentRankingToCSVShouldContainHeaderAndRankingLines() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);

        Edu_Student s1 = new Edu_Student();
        s1.register("s1@example.com", "p1", "S1");
        Edu_Student s2 = new Edu_Student();
        s2.register("s2@example.com", "p2", "S2");

        course.enrollStudent(s1);
        course.enrollStudent(s2);

        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);
        s1.addAward(new Edu_AwardsAssigment(award, teacher, s1, null, LocalDateTime.now(), "R1"));
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R2"));
        s2.addAward(new Edu_AwardsAssigment(award, teacher, s2, null, LocalDateTime.now(), "R3"));

        // Act
        String csv = course.exportStudentRankingToCSV();

        // Assert
        String[] lines = csv.split("\n");
        assertEquals("name,email,totalScore", lines[0].trim());
        // s2 should be first (20 pts), s1 second (10 pts)
        assertTrue(lines[1].contains("S2"));
        assertTrue(lines[2].contains("S1"));
    }
}