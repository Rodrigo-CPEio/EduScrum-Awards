package devapp.upt;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EduProjectCalculateAverageEvaluationValueTest {

    @Test
    void calculateAverageEvaluationValueShouldReturnAverageOfNumericValues() {
        // Arrange
        Edu_Course course = new Edu_Course("C", "D", new Edu_Teacher());
        Edu_Project project = new Edu_Project("Proj", course);
        Edu_Team team = new Edu_Team("Team", project);
        Edu_Sprint sprint = new Edu_Sprint(LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Obj", project);

        project.addEvaluation(new Edu_Evaluation(sprint, team, "progress", "80"));
        project.addEvaluation(new Edu_Evaluation(sprint, team, "progress", "100"));

        // Act
        double average = project.calculateAverageEvaluationValue();

        // Assert
        assertEquals(90.0, average);
    }

    @Test
    void calculateAverageEvaluationValueShouldReturnZeroIfNoEvaluations() {
        // Arrange
        Edu_Project project = new Edu_Project("Proj", new Edu_Course("C", "D", new Edu_Teacher()));

        // Act & Assert
        assertEquals(0.0, project.calculateAverageEvaluationValue());
    }

    @Test
    void calculateAverageEvaluationValueShouldTreatNonNumericAsZero() {
        // Arrange
        Edu_Course course = new Edu_Course("C", "D", new Edu_Teacher());
        Edu_Project project = new Edu_Project("Proj", course);
        Edu_Team team = new Edu_Team("Team", project);
        Edu_Sprint sprint = new Edu_Sprint(LocalDateTime.now(), LocalDateTime.now().plusDays(7), "Obj", project);

        project.addEvaluation(new Edu_Evaluation(sprint, team, "progress", "abc"));
        project.addEvaluation(new Edu_Evaluation(sprint, team, "progress", "100"));

        // Act
        double average = project.calculateAverageEvaluationValue();

        // Assert
        assertEquals(50.0, average);
    }
}
