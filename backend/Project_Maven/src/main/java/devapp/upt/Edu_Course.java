package devapp.upt;

import java.util.ArrayList;
import java.util.Collections;
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

    /**
     * Returns an unmodifiable view of projects within this course.
     *
     * @return projects list
     */
    public List<Edu_Project> getProjects() {
        return Collections.unmodifiableList(projects);
    }

    /**
     * Adds a project to this course. Null values are ignored.
     *
     * @param project the project to add
     */
    public void addProject(Edu_Project project) {
        if (project == null) {
            return;
        }
        projects.add(project);
    }

    /**
     * Enrolls a student in the course. Null values are ignored.
     *
     * @param student the student to enroll
     */
    public void enrollStudent(Edu_Student student) {
        if (student == null) {
            return;
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

    @Override
    public String toString() {
        return "Edu_Course{" + "name='" + name + '\'' + ", teacher=" + (teacher != null ? teacher.getName() : "null") + '}';
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStudents(List<Edu_Student> students) {
        this.students = students;
    }
}
