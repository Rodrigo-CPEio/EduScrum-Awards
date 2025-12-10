package devapp.upt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;

public class EduProjectAddEvaluationTest {

    @Test
    void addEvaluationShouldAddWhenNotNull() {
        // Arrange
        Edu_Course course = new Edu_Course("C", "D", new Edu_Teacher());
        Edu_Project project = new Edu_Project("Proj", course);
        Edu_Team team = new Edu_Team("Team", project);
        Edu_Sprint sprint = new Edu_Sprint(LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Obj", project);
        Edu_Evaluation eval = new Edu_Evaluation(sprint, team, "progress", "80");

        // Act
        project.addEvaluation(eval);

        // Assert
        assertTrue(project.getEvaluations().contains(eval));
    }

    @Test
    void addEvaluationShouldIgnoreNull() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));

        // Act
        project.addEvaluation(null);

        // Assert
        assertTrue(project.getEvaluations().isEmpty());
    }
}