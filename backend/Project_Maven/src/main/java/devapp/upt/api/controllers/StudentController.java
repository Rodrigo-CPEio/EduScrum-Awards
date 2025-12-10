package devapp.upt.api.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import devapp.upt.Edu_Project;
import devapp.upt.Edu_Student;
import devapp.upt.Edu_Team;
import devapp.upt.api.dto.AwardAssignmentResponse;
import devapp.upt.api.dto.LoginDTO;
import devapp.upt.api.dto.StudentCreateTeamDTO;
import devapp.upt.api.dto.StudentJoinTeamDTO;
import devapp.upt.api.dto.StudentRegisterDTO;
import devapp.upt.api.dto.StudentResponse;
import devapp.upt.api.dto.StudentUpdateDTO;
import devapp.upt.api.services.CourseService;
import devapp.upt.api.services.ProjectService;
import devapp.upt.api.services.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService students;
    private final ProjectService projects;
    private final CourseService courses;

    public StudentController(StudentService students, ProjectService projects, CourseService courses) {
        this.students = students;
        this.projects = projects;
        this.courses = courses;
    }

    @PostMapping("/register")
    public ResponseEntity<StudentResponse> register(@RequestBody StudentRegisterDTO dto) {
        Edu_Student s = students.register(dto.email, dto.password, dto.name);
        return ResponseEntity.status(HttpStatus.CREATED).body(new StudentResponse(s));
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginDTO dto) {
        return students.login(dto.email, dto.password)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping
    public List<StudentResponse> listStudents() {
        return students.findAll().stream()
                .map(StudentResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{email}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable String email) {
        Edu_Student s = students.findByEmail(email);
        return (s == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new StudentResponse(s));
    }

    @GetMapping("/{email}/awards")
    public ResponseEntity<?> getAwards(@PathVariable String email) {
        Edu_Student s = students.findByEmail(email);
        if (s == null) {
            return ResponseEntity.notFound().build();
        }

        List<AwardAssignmentResponse> res = s.getAwardHistory().stream()
                .map(AwardAssignmentResponse::new)
                .toList();

        return ResponseEntity.ok(res);
    }

    @PostMapping("/{email}/create-team")
    public ResponseEntity<?> createTeam(
            @PathVariable String email,
            @RequestBody StudentCreateTeamDTO dto
    ) {
        Edu_Student student = students.findByEmail(email);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        Edu_Project project = projects.findByName(dto.projectName);
        if (project == null) {
            return ResponseEntity.badRequest().body("Project not found");
        }

        Edu_Team team = students.createTeam(student, project, dto.teamName);

        return ResponseEntity.status(HttpStatus.CREATED).body(team.getName());
    }

    @PostMapping("/{email}/join-team")
    public ResponseEntity<?> joinTeam(
            @PathVariable String email,
            @RequestBody StudentJoinTeamDTO dto
    ) {
        Edu_Student student = students.findByEmail(email);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        Edu_Project p = projects.findByName(dto.projectName);
        if (p == null) {
            return ResponseEntity.badRequest().body("Project not found");
        }

        Edu_Team team = p.getTeams().stream()
                .filter(t -> t.getName().equals(dto.teamName))
                .findFirst().orElse(null);

        if (team == null) {
            return ResponseEntity.badRequest().body("Team not found");
        }

        students.joinTeam(student, team);

        return ResponseEntity.ok("Joined team: " + team.getName());
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateStudent(
            @PathVariable String email,
            @RequestBody StudentUpdateDTO dto) {

        Edu_Student s = students.findByEmail(email);
        if (s == null) {
            return ResponseEntity.notFound().build();
        }

        s.setName(dto.name);
        return ResponseEntity.ok(new StudentResponse(s));
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteStudent(@PathVariable String email) {

        boolean removed = students.delete(email);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        // remover o aluno dos cursos
        courses.removeStudentFromAllCourses(email);

        return ResponseEntity.ok("Deleted");
    }
}
