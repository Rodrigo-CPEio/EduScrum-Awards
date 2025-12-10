package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduCourseExportTeamRankingCSVTest {

    @Test
    void exportTeamRankingToCSVShouldContainHeaderAndRankingLines() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("C1", "desc", teacher);
        Edu_Project project = new Edu_Project("Proj", course);
        course.addProject(project);

        Edu_Team low = new Edu_Team("Low", project);
        Edu_Team high = new Edu_Team("High", project);

        project.addTeam(low);
        project.addTeam(high);

        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);
        low.addAward(new Edu_AwardsAssigment(award, teacher, null, low, LocalDateTime.now(), "R1"));
        high.addAward(new Edu_AwardsAssigment(award, teacher, null, high, LocalDateTime.now(), "R2"));
        high.addAward(new Edu_AwardsAssigment(award, teacher, null, high, LocalDateTime.now(), "R3"));

        // Act
        String csv = course.exportTeamRankingToCSV();

        // Assert
        String[] lines = csv.split("\n");
        assertEquals("teamName,totalScore", lines[0].trim());
        assertTrue(lines[1].contains("High"));
        assertTrue(lines[2].contains("Low"));
    }
}