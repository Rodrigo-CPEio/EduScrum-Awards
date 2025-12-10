package devapp.upt.api.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import devapp.upt.Edu_Project;
import devapp.upt.Edu_Student;
import devapp.upt.Edu_Team;

@Service
public class StudentService {

    private final List<Edu_Student> students = new ArrayList<>();

    public Edu_Student register(String email, String password, String name) {
        Edu_Student s = new Edu_Student();
        s.register(email, password, name);
        students.add(s);
        return s;
    }

    public boolean login(String email, String password) {
        return students.stream().anyMatch(s -> s.login(email, password));
    }

    public List<Edu_Student> findAll() {
        return new ArrayList<>(students);
    }

    public Edu_Student findByEmail(String email) {
        return students.stream()
                .filter(s -> email.equals(s.getEmail()))
                .findFirst()
                .orElse(null);
    }

    public Edu_Team createTeam(Edu_Student student, Edu_Project project, String name) {
        return student.createTeam(project, name);
    }

    public void joinTeam(Edu_Student student, Edu_Team team) {
        student.joinTeam(team);
    }

    public boolean delete(String email) {
        Edu_Student s = findByEmail(email);
        if (s == null) return false;

        return students.remove(s);
    }
}
