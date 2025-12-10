package devapp.upt;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduStudentTeamsViewTest {

    @Test
    void getTeamsShouldReturnUnmodifiableList() {
        // Arrange
        Edu_Teacher teacher = new Edu_Teacher();
        Edu_Course course = new Edu_Course("SQ", "desc", teacher);
        Edu_Project project = new Edu_Project("Proj", course);
        Edu_Team team = new Edu_Team("T1", project);
        Edu_Student student = new Edu_Student();
        student.joinTeam(team);

        // Act
        List<Edu_Team> teams = student.getTeams();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> teams.add(team));
    }
}