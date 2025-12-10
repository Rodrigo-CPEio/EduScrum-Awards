package devapp.upt;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Represents an educational student.
 *
 * Follows the same conventions as other classes: defaults for user fields,
 * enums for structured fields, constructors chaining and calling super(...).
 *
 * Author: Rodrigo Miguel dos Santos Sousa from QS_DevTeam - UPT Version: 1.0
 */
public class Edu_Student extends Edu_User {

    // Student-specific attributes
    private Year year;
    private StudentClass studentClass;

    // Gamification / Awards / Teams
    private final List<Edu_AwardsAssigment> awardHistory = new ArrayList<>();
    private final List<Edu_Team> teams = new ArrayList<>();

    // Default constants (user defaults reused pattern from EduTeacher)
    private static final String DEFAULT_EMAIL = "unknown@upt.pt";
    private static final String DEFAULT_PASSWORD = "changeme";
    private static final String DEFAULT_NAME = "Unnamed Student";

    // Default values for student-specific fields
    private static final Year DEFAULT_YEAR = Year.FIRST;
    private static final StudentClass DEFAULT_STUDENT_CLASS = StudentClass.A;

    // Year enum similar style to Dept in EduTeacher
    public enum Year {
        FIRST("1.º Ano"),
        SECOND("2.º Ano"),
        THIRD("3.º Ano"),
        FOURTH("4.º Ano");

        private final String displayName;

        Year(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Student class group (Turma) enum
    public enum StudentClass {
        A("Turma A"),
        B("Turma B"),
        C("Turma C"),
        D("Turma D");

        private final String displayName;

        StudentClass(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * Default constructor: uses default year and class and default user fields.
     */
    public Edu_Student() {
        this(DEFAULT_YEAR, DEFAULT_STUDENT_CLASS);
    }

    /**
     * Constructor specifying only the year.
     *
     * @param year the academic year
     */
    public Edu_Student(Year year) {
        this(year, DEFAULT_STUDENT_CLASS);
    }

    /**
     * Constructor specifying only the student class (turma).
     *
     * @param studentClass turma
     */
    public Edu_Student(StudentClass studentClass) {
        this(DEFAULT_YEAR, studentClass);
    }

    /**
     * Full constructor for student-specific fields. Initializes the parent
     * EduUser with default user fields following the same pattern as
     * EduTeacher.
     *
     * @param year the academic year
     * @param studentClass the class group (turma)
     */
    public Edu_Student(Year year, StudentClass studentClass) {
        super(DEFAULT_EMAIL, DEFAULT_PASSWORD, DEFAULT_NAME);
        this.year = year;
        this.studentClass = studentClass;
    }

    // Getters and setters
    /**
     * Returns the student's academic year.
     *
     * @return the year
     */
    public Year getYear() {
        return year;
    }

    /**
     * Sets the student's academic year.
     *
     * @param year the year to set
     */
    public void setYear(Year year) {
        this.year = year;
    }

    /**
     * Returns the student's class group (turma).
     *
     * @return the student class
     */
    public StudentClass getStudentClass() {
        return studentClass;
    }

    /**
     * Sets the student's class group (turma).
     *
     * @param studentClass the class to set
     */
    public void setStudentClass(StudentClass studentClass) {
        this.studentClass = studentClass;
    }

    /**
     * Registers the student with provided credentials (simulation).
     *
     * @param email student email
     * @param password student raw password
     * @param name student name
     * @return true if registration succeeded (simulated)
     */
    public boolean register(String email, String password, String name) {
        setEmail(email);
        setPassword(password);
        setName(name);
        return true;
    }

    /**
     * Authentication simulation for student.
     *
     * @param email provided email
     * @param password provided raw password
     * @return true if credentials match
     */
    public boolean login(String email, String password) {
        return getEmail().equals(email) && verifyPassword(password);
    }

    // ============================================================
    // GAMIFICATION / SCORING
    // ============================================================
    public void addAward(Edu_AwardsAssigment award) {
        if (award != null) {
            awardHistory.add(award);
        }
    }

    public List<Edu_AwardsAssigment> getAwardHistory() {
        return Collections.unmodifiableList(awardHistory);
    }

    public long getTotalScore() {
        return awardHistory.stream()
                .mapToLong(a -> a.getAward().getPoints())
                .sum();
    }

    /**
     * Allows a student to join an existing team as a Developer.
     * @param team
     */
    public void joinTeam(Edu_Team team) {
        if (team == null) {
            return;
        }

        if (teams.contains(team)) {
            throw new IllegalArgumentException("Student already in this team");
        }

        teams.add(team);
        team.addMember(this, Edu_TeamMember.Role.DEVELOPER);
    }

    public List<Edu_Team> getTeams() {
        return Collections.unmodifiableList(teams);
    }

    public double compareWithCourseAverage(Edu_Course course) {
        if (course == null || course.getStudents().isEmpty()) {
            return 0;
        }
        return getTotalScore() - course.getAverageScoreOfStudents();
    }

    /**
     * Allows a student to create a new Scrum team inside a project.
     *
     * @param project the project where the new team will be created
     * @param teamName the name of the team
     * @return the created team
     */
    public Edu_Team createTeam(Edu_Project project, String teamName) {
        if (project == null || teamName == null || teamName.isBlank()) {
            throw new IllegalArgumentException("Project and team name must be valid.");
        }

        Edu_Team team = new Edu_Team(teamName, project);
        project.addTeam(team);

        // automatically add the student as Developer and join the team
        team.addMember(this, Edu_TeamMember.Role.DEVELOPER);
        teams.add(team);

        return team;
    }
}
