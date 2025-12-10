package devapp.upt;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduProjectTeamsUnmodifiableTest {

    @Test
    void getTeamsShouldReturnUnmodifiableList() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Team team = new Edu_Team("Team", project);
        project.addTeam(team);

        // Act
        List<Edu_Team> teams = project.getTeams();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> teams.add(team));
    }
}