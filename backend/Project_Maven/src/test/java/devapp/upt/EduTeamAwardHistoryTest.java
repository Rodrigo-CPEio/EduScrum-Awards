package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduTeamAwardHistoryTest {

    @Test
    void getAwardHistoryShouldBeUnmodifiable() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Team team = new Edu_Team("Team", null);
        Edu_Awards award = new Edu_Awards("A", "D", 10, "MANUAL", "none", teacher);
        Edu_AwardsAssigment assignment = new Edu_AwardsAssigment(award, teacher, null, team, LocalDateTime.now(), "R1");
        team.addAward(assignment);

        // Act
        List<Edu_AwardsAssigment> history = team.getAwardHistory();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> history.add(assignment));
    }
}
