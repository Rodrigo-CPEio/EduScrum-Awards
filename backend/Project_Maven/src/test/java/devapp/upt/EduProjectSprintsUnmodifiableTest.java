package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

public class EduProjectSprintsUnmodifiableTest {

    @Test
    void getSprintsShouldReturnUnmodifiableList() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Sprint sprint = new Edu_Sprint(LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Obj", project);
        project.addSprint(sprint);

        // Act
        List<Edu_Sprint> sprints = project.getSprints();

        // Assert
        assertThrows(UnsupportedOperationException.class, () -> sprints.add(sprint));
    }
}