package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduCourseTeamRankingTest {

    @Test
    void getTeamRankingShouldOrderTeamsByScoreDescending() {
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

        low.addAward(new Edu_AwardsAssigment(award, teacher, null, low, LocalDateTime.now(), "R1")); // 10
        high.addAward(new Edu_AwardsAssigment(award, teacher, null, high, LocalDateTime.now(), "R2")); // 10
        high.addAward(new Edu_AwardsAssigment(award, teacher, null, high, LocalDateTime.now(), "R3")); // 20

        // Act
        List<Edu_Team> ranking = course.getTeamRanking();

        // Assert
        assertEquals(high, ranking.get(0));
        assertEquals(low, ranking.get(1));
    }
}
