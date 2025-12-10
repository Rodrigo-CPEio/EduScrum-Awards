package devapp.upt;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class EduProjectAddTeamTest {

    @Test
    void addTeamShouldAddWhenNotNull() {
        // Arrange
        Edu_Project project = new Edu_Project(
                "Proj",
                new Edu_Course("C", "D", new Edu_Teacher())
        );
        Edu_Team team = new Edu_Team("Team", project);

        // Act
        project.addTeam(team);

        // Assert
        assertTrue(project.getTeams().contains(team));
    }

    @Test
    void addTeamShouldIgnoreNull() {
        // Arrange
        Edu_Project project = new Edu_Project(
                "Proj",
                new Edu_Course("C", "D", new Edu_Teacher())
        );

        // Act
        project.addTeam(null);

        // Assert
        assertTrue(project.getTeams().isEmpty());
    }

    @Test
    void addTeamShouldNotAllowDuplicateTeamNames() {
        // Arrange
        Edu_Project project = new Edu_Project(
                "Proj",
                new Edu_Course("C", "D", new Edu_Teacher())
        );

        Edu_Team team1 = new Edu_Team("Team", project);
        Edu_Team team2 = new Edu_Team("Team", project); // mesmo nome

        // Act
        project.addTeam(team1);

        // Assert
        assertThrows(
                IllegalArgumentException.class,
                () -> project.addTeam(team2)
        );
    }
}