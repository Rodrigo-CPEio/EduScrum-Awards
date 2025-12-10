package devapp.upt.api.services;

import devapp.upt.Edu_Course;
import devapp.upt.Edu_Project;
import devapp.upt.Edu_Teacher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final List<Edu_Project> projects = new ArrayList<>();

    public Edu_Project register(Edu_Project p) {
        if (p != null && !projects.contains(p)) {
            projects.add(p);
        }
        return p;
    }

    public Edu_Project createProject(Edu_Teacher teacher, Edu_Course course, String name) {
        Edu_Project p = teacher.createProject(course, name);
        return register(p);
    }

    public List<Edu_Project> findAll() {
        return new ArrayList<>(projects);
    }

    public Edu_Project findByName(String name) {
        return projects.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public List<Edu_Project> findByCourse(Edu_Course course) {
        List<Edu_Project> res = new ArrayList<>();
        for (Edu_Project p : projects) {
            if (p.getCourse() == course) res.add(p);
        }
        return res;
    }
}