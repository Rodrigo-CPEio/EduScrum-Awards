package devapp.upt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Minimal implementation of a Project used by Edu_Teacher and other classes.
 */
public class Edu_Project {

    private final String name;
    private final Edu_Course course;
    private final List<Edu_Team> teams;
    private final List<Edu_Sprint> sprints;
    private final List<Edu_Evaluation> evaluations;

    public Edu_Project(String name, Edu_Course course) {
        this.name = name;
        this.course = course;
        this.teams = new ArrayList<>();
        this.sprints = new ArrayList<>();
        this.evaluations = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public Edu_Course getCourse() {
        return course;
    }

    /**
     * Returns an unmodifiable list of teams in this project.
     * @return the teams
     */
     
    public List<Edu_Team> getTeams() {
        return Collections.unmodifiableList(teams);
    }

    /**
     * Adds a team to the project. Null values are ignored.
     * @param team the team to add
     * @throws IllegalArgumentException if a team with the same name already exists in the project
     * 
     */
    public void addTeam(Edu_Team team) {
        if (team == null) {
            return;
        }

        boolean exists = teams.stream()
                .anyMatch(t -> t.getName().equalsIgnoreCase(team.getName()));

        if (exists) {
            throw new IllegalArgumentException("A team with this name already exists in the project");
        }

        teams.add(team);
    }

    /**
     * Adds a sprint to the project. Null values are ignored.
     *
     * @param sprint the sprint to add
     */
    public void addSprint(Edu_Sprint sprint) {
        if (sprint == null) {
            return;
        }
        sprints.add(sprint);
    }

    /**
     * Returns an unmodifiable list of sprints in this project.
     *
     * @return the sprints
     */
    public List<Edu_Sprint> getSprints() {
        return Collections.unmodifiableList(sprints);
    }

    public void addEvaluation(Edu_Evaluation evaluation) {
        if (evaluation != null) {
            evaluations.add(evaluation);
        }
    }

    public List<Edu_Evaluation> getEvaluations() {
        return Collections.unmodifiableList(evaluations);
    }

    public double calculateAverageEvaluationValue() {
        return evaluations.stream()
                .map(Edu_Evaluation::getValue)
                .mapToInt(v -> {
                    try {
                        return Integer.parseInt(v);
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .average()
                .orElse(0);
    }
}
