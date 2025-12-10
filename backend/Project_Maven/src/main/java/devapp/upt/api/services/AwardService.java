package devapp.upt.api.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import devapp.upt.Edu_Awards;
import devapp.upt.Edu_AwardsAssigment;
import devapp.upt.Edu_Course;
import devapp.upt.Edu_Project;
import devapp.upt.Edu_Student;
import devapp.upt.Edu_Teacher;
import devapp.upt.Edu_Team;

@Service
public class AwardService {

    private final List<Edu_Awards> awards = new ArrayList<>();
    private final TeacherService teachers;
    private final StudentService students;
    private final CourseService courses;
    private final ProjectService projects;
    private final TeamService teams;

    public AwardService(TeacherService teachers,
            StudentService students,
            CourseService courses,
            ProjectService projects,
            TeamService teams) {
        this.teachers = teachers;
        this.students = students;
        this.courses = courses;
        this.projects = projects;
        this.teams = teams;
    }

    public Edu_Awards createAward(String teacherEmail,
            String name,
            String description,
            long points,
            String type,
            String triggerCondition) {
        Edu_Teacher t = teachers.findByEmail(teacherEmail);
        if (t == null) {
            throw new IllegalArgumentException("Teacher not found");
        }
        if (awards.stream().anyMatch(a -> a.getName().equalsIgnoreCase(name))) {
            throw new IllegalArgumentException("Award already exists");
        }
        Edu_Awards a = new Edu_Awards(name, description, points, type, triggerCondition, t);
        awards.add(a);
        return a;
    }

    public List<Edu_Awards> listAwards() {
        return new ArrayList<>(awards);
    }

    public Edu_Awards findByName(String name) {
        return awards.stream()
                .filter(a -> a.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    public Edu_AwardsAssigment assignToStudent(String teacherEmail,
            String studentEmail,
            String awardName,
            String reason) {
        Edu_Teacher t = teachers.findByEmail(teacherEmail);
        if (t == null) {
            throw new IllegalArgumentException("Teacher not found");
        }

        Edu_Student s = students.findByEmail(studentEmail);
        if (s == null) {
            throw new IllegalArgumentException("Student not found");
        }

        Edu_Awards a = findByName(awardName);
        if (a == null) {
            throw new IllegalArgumentException("Award not found");
        }

        return t.assignAwardToStudent(a, s, reason);
    }

    public Edu_AwardsAssigment assignToTeam(String teacherEmail,
            String projectName,
            String teamName,
            String awardName,
            String reason) {
        Edu_Teacher t = teachers.findByEmail(teacherEmail);
        if (t == null) {
            throw new IllegalArgumentException("Teacher not found");
        }

        Edu_Project p = projects.findByName(projectName);
        if (p == null) {
            throw new IllegalArgumentException("Project not found");
        }

        Edu_Team team = teams.findTeam(p, teamName);
        if (team == null) {
            throw new IllegalArgumentException("Team not found");
        }

        Edu_Awards a = findByName(awardName);
        if (a == null) {
            throw new IllegalArgumentException("Award not found");
        }

        return t.assignAwardToTeam(a, team, reason);
    }

    public List<Edu_AwardsAssigment> assignAutomatic(String teacherEmail,
            String courseName,
            String awardName,
            long minScore) {
        Edu_Teacher t = teachers.findByEmail(teacherEmail);
        if (t == null) {
            throw new IllegalArgumentException("Teacher not found");
        }

        Edu_Course c = courses.findByName(courseName);
        if (c == null) {
            throw new IllegalArgumentException("Course not found");
        }

        Edu_Awards a = findByName(awardName);
        if (a == null) {
            throw new IllegalArgumentException("Award not found");
        }

        return t.assignAutomaticAwardsByScore(c, a, minScore);
    }
}
