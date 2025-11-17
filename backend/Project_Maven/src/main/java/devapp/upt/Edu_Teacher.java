package devapp.upt;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Represents an educational teacher with ability to manage courses, projects,
 * teams, and roles.
 *
 * Author: Rodrigo Miguel dos Santos Sousa from QS_DevTeam - UPT Version: 1.1
 */
public class Edu_Teacher extends Edu_User {

    private String institution;
    private List<Department> departments;

    // Teacher's courses
    private List<Edu_Course> courses;

    // Default constants
    private static final String DEFAULT_INSTITUTION = "Universidade Portucalense";
    private static final Department DEFAULT_DEPARTMENT = Department.CIEN_TEC;
    private static final String DEFAULT_EMAIL = "unknown@upt.pt";
    private static final String DEFAULT_PASSWORD = "changeme";
    private static final String DEFAULT_NAME = "Unnamed Teacher";

    // Enum for Departments
    public enum Department {
        ARQ_MULTIMEDIA("Arquitetura e Multimédia Gallaecia"),
        CIEN_TEC("Ciência e Tecnologia"),
        DIREITO("Direito"),
        ECON_GEST("Economia e Gestão"),
        PSIC_EDUC("Psicologia e Educação"),
        TUR_PATRIMONIO("Turismo Património e Cultura");

        private final String displayName;

        Department(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // ========================
    // Constructors
    // ========================
    public Edu_Teacher() {
        this(Arrays.asList(DEFAULT_DEPARTMENT), DEFAULT_INSTITUTION);
    }

    public Edu_Teacher(Department department) {
        this(department, DEFAULT_INSTITUTION);
    }

    public Edu_Teacher(Department department, String institution) {
        this(Arrays.asList(department), institution);
    }

    public Edu_Teacher(List<Department> departments, String institution) {
        super(DEFAULT_EMAIL, DEFAULT_PASSWORD, DEFAULT_NAME);
        this.departments = departments;
        this.institution = institution;
        this.courses = new ArrayList<>();
    }

    public Edu_Teacher(List<Department> departments) {
        this(departments, DEFAULT_INSTITUTION);
    }

    // ========================
    // Getters and Setters
    // ========================
    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public List<Edu_Course> getCourses() {
        return courses;
    }

    // ========================
    // Functional Methods
    // ========================
    /**
     * Teacher registration simulation. In a real scenario, this would save
     * teacher to database.
     */
    /**
     * Registers the teacher with the provided credentials (simulation).
     *
     * @param email teacher email
     * @param password teacher password (raw) — will be handled by parent class
     * @param name teacher name
     * @return true if registration succeeded (simulated)
     */
    public boolean register(String email, String password, String name) {
        setEmail(email);
        setPassword(password);
        setName(name);
        // Here you would normally persist this in DB
        return true; // assume success
    }

    /**
     * Teacher authentication simulation.
     */
    public boolean login(String email, String password) {
        return getEmail().equals(email) && verifyPassword(password);
    }

    /**
     * Create a new course and assign to this teacher
     */
    public Edu_Course createCourse(String courseName, String description) {
        Edu_Course course = new Edu_Course(courseName, description, this);
        courses.add(course);
        return course;
    }

    /**
     * Create a new project within a specific course
     */
    public Edu_Project createProject(Edu_Course course, String projectName) {
        if (!courses.contains(course)) {
            throw new IllegalArgumentException("Teacher does not manage this course.");
        }
        Edu_Project project = new Edu_Project(projectName, course);
        course.addProject(project);
        return project;
    }

    /**
     * Define a Scrum team in a project
     */
    public Edu_Team defineTeam(Edu_Project project, String teamName) {
        Edu_Team team = new Edu_Team(teamName, project);
        project.addTeam(team);
        return team;
    }

    /**
     * Assign roles to students in a Scrum team
     */
    public void assignRole(Edu_Team team, Edu_Student student, String role) {
        team.addMember(student, role);
    }

    @Override
    public String toString() {
        return "Edu_Teacher{"
                + "name='" + getName() + '\''
                + ", email='" + getEmail() + '\''
                + ", institution='" + institution + '\''
                + ", departments=" + departments
                + ", courses=" + courses.size()
                + '}';
    }
}
