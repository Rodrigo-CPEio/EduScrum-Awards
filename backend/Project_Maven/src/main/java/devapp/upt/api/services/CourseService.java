package devapp.upt.api.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import devapp.upt.Edu_Course;
import devapp.upt.Edu_Student;
import devapp.upt.Edu_Teacher;

@Service
public class CourseService {

    private final List<Edu_Course> courses = new ArrayList<>();
    private final TeacherService teachers;
    private final StudentService students;

    public CourseService(TeacherService teachers, StudentService students) {
        this.teachers = teachers;
        this.students = students;
    }

    public Edu_Course createCourse(String teacherEmail, String name, String description) {
        Edu_Teacher t = teachers.findByEmail(teacherEmail);
        if (t == null) {
            throw new IllegalArgumentException("Teacher not found");
        }
        Edu_Course c = t.createCourse(name, description);
        courses.add(c);
        return c;
    }

    public List<Edu_Course> findAll() {
        return new ArrayList<>(courses);
    }

    public Edu_Course findByName(String name) {
        return courses.stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public void enrollStudent(String courseName, String studentEmail) {
        Edu_Course c = findByName(courseName);
        if (c == null) {
            throw new IllegalArgumentException("Course not found");
        }

        Edu_Student s = students.findByEmail(studentEmail);
        if (s == null) {
            throw new IllegalArgumentException("Student not found");
        }

        c.enrollStudent(s);
    }

    public boolean delete(String name) {
        return courses.removeIf(c -> c.getName().equals(name));
    }

    public void removeStudentFromAllCourses(String email) {
        for (Edu_Course c : courses) {
            c.setStudents(
                    c.getStudents().stream()
                            .filter(st -> !st.getEmail().equals(email))
                            .toList()
            );
        }
    }
}
