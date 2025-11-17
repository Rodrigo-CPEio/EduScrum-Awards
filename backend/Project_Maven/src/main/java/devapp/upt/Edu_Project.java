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

    public Edu_Project(String name, Edu_Course course) {
        this.name = name;
        this.course = course;
        this.teams = new ArrayList<>();
        this.sprints = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public Edu_Course getCourse() {
        return course;
    }

    /**
     * Returns an unmodifiable list of teams in this project.
     *
     * @return the teams
     */
    public List<Edu_Team> getTeams() {
        return Collections.unmodifiableList(teams);
    }

    /**
     * Adds a team to the project. Null values are ignored.
     *
     * @param team the team to add
     */
    public void addTeam(Edu_Team team) {
        if (team == null) {
            return;
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

    @Override
    public String toString() {
        return "Edu_Project{" + "name='" + name + '\'' + ", course=" + (course != null ? course.getName() : "null") + '}';
    }
}
