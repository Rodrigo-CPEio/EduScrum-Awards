package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class EduProjectAddSprintTest {

    @Test
    void addSprintShouldAddWhenNotNull() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));
        Edu_Sprint sprint = new Edu_Sprint(LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Objectives", project);

        // Act
        project.addSprint(sprint);

        // Assert
        assertTrue(project.getSprints().contains(sprint));
    }

    @Test
    void addSprintShouldIgnoreNull() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));

        // Act
        project.addSprint(null);

        // Assert
        assertTrue(project.getSprints().isEmpty());
    }
}