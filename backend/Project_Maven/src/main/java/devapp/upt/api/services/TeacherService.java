package devapp.upt.api.services;

import devapp.upt.Edu_Teacher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeacherService {

    private final List<Edu_Teacher> teachers = new ArrayList<>();

    public Edu_Teacher register(String email, String password, String name) {
        Edu_Teacher t = new Edu_Teacher();
        t.register(email, password, name);
        teachers.add(t);
        return t;
    }

    public boolean login(String email, String password) {
        return teachers.stream().anyMatch(t -> t.login(email, password));
    }

    public List<Edu_Teacher> findAll() {
        return new ArrayList<>(teachers);
    }

    public Edu_Teacher findByEmail(String email) {
        return teachers.stream()
                .filter(t -> email.equals(t.getEmail()))
                .findFirst()
                .orElse(null);
    }
}