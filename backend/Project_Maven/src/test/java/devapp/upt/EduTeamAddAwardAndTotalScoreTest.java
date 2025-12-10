package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduTeamAddAwardAndTotalScoreTest {

    @Test
    void addAwardShouldIncreaseTeamScore() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Team team = new Edu_Team("Team", null);
        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);

        // Act
        team.addAward(new Edu_AwardsAssigment(award, teacher, null, team, LocalDateTime.now(), "R1"));

        // Assert
        assertEquals(10L, team.getTotalScore());
    }

    @Test
    void addAwardShouldIgnoreNull() {
        // Arrange
        Edu_Team team = new Edu_Team("Team", null);

        // Act
        team.addAward(null);

        // Assert
        assertEquals(0L, team.getTotalScore());
    }
}
