package devapp.upt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Minimal implementation of a Course used by Edu_Teacher and other classes.
 */
public class Edu_Course {

    private final String name;
    private String description;
    private final Edu_Teacher teacher;
    private final List<Edu_Project> projects;
    private List<Edu_Student> students;

    public Edu_Course(String name, String description, Edu_Teacher teacher) {
        this.name = name;
        this.description = description;
        this.teacher = teacher;
        this.projects = new ArrayList<>();
        this.students = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Edu_Teacher getTeacher() {
        return teacher;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStudents(List<Edu_Student> students) {
        this.students = students;
    }

    /**
     * Returns an unmodifiable view of projects within this course.
     *
     * @return projects list
     */
    public List<Edu_Project> getProjects() {
        return Collections.unmodifiableList(projects);
    }

    /**
     * Adds a project to the course. Null values are ignored.
     * @param project the project to add
     * @throws IllegalArgumentException if a project with the same name already exists in the
     * course
     */
    public void addProject(Edu_Project project) {
    if (project == null) return;

    // PREVENT DUPLICATE PROJECTS
    if (projects.contains(project)) {
        throw new IllegalArgumentException("Project already exists in this course");
    }

    projects.add(project);
}

    /**
     * Enroll a student in this course. Duplicate enrollments are prevented.
     * @param student the student to enroll
     * @throws IllegalArgumentException if the student is already enrolled
     * 
     */
    public void enrollStudent(Edu_Student student) {
    if (student == null) return;

    // PREVENT DUPLICATE STUDENTS
    if (students.contains(student)) {
        throw new IllegalArgumentException("Student already enrolled in this course");
    }

    students.add(student);
}

    /**
     * Returns an unmodifiable list of enrolled students.
     *
     * @return the enrolled students
     */
    public List<Edu_Student> getStudents() {
        return Collections.unmodifiableList(students);
    }

    // ============================================================
    // SCORING / RANKING / DASHBOARD SUPPORT
    // ============================================================
    public double getAverageScoreOfStudents() {
        if (students.isEmpty()) {
            return 0;
        }
        return students.stream()
                .mapToLong(Edu_Student::getTotalScore)
                .average()
                .orElse(0);
    }

    public List<Edu_Student> getStudentRanking() {
        List<Edu_Student> sorted = new ArrayList<>(students);
        sorted.sort(Comparator.comparingLong(Edu_Student::getTotalScore).reversed());
        return Collections.unmodifiableList(sorted);
    }

    public List<Edu_Team> getTeamRanking() {
        List<Edu_Team> allTeams = new ArrayList<>();
        for (Edu_Project p : projects) {
            allTeams.addAll(p.getTeams());
        }
        allTeams.sort(Comparator.comparingLong(Edu_Team::getTotalScore).reversed());
        return Collections.unmodifiableList(allTeams);
    }

    /**
     * Exports student ranking to CSV format.
     *
     * @return CSV text containing: name,email,totalScore
     */
    public String exportStudentRankingToCSV() {
        StringBuilder sb = new StringBuilder();
        sb.append("name,email,totalScore\n");

        for (Edu_Student s : getStudentRanking()) {
            sb.append(s.getName()).append(",")
                    .append(s.getEmail()).append(",")
                    .append(s.getTotalScore()).append("\n");
        }

        return sb.toString();
    }

    /**
     * Exports team ranking to CSV format.
     *
     * @return CSV text containing: teamName,totalScore
     */
    public String exportTeamRankingToCSV() {
        StringBuilder sb = new StringBuilder();
        sb.append("teamName,totalScore\n");

        for (Edu_Team t : getTeamRanking()) {
            sb.append(t.getName()).append(",")
                    .append(t.getTotalScore()).append("\n");
        }

        return sb.toString();
    }
}
