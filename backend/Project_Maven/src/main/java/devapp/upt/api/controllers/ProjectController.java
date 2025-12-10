 package devapp.upt.api.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import devapp.upt.Edu_Course;
import devapp.upt.Edu_Evaluation;
import devapp.upt.Edu_Project;
import devapp.upt.Edu_Sprint;
import devapp.upt.Edu_Teacher;
import devapp.upt.Edu_Team;
import devapp.upt.api.dto.EvaluationCreateDTO;
import devapp.upt.api.dto.ProjectCreateDTO;
import devapp.upt.api.dto.ProjectResponse;
import devapp.upt.api.dto.SprintCreateDTO;
import devapp.upt.api.services.CourseService;
import devapp.upt.api.services.ProjectService;
import devapp.upt.api.services.TeacherService;
import devapp.upt.api.services.TeamService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projects;
    private final CourseService courses;
    private final TeacherService teachers;
    private final TeamService teams;

    public ProjectController(ProjectService projects,
                             CourseService courses,
                             TeacherService teachers,
                             TeamService teams) {
        this.projects = projects;
        this.courses = courses;
        this.teachers = teachers;
        this.teams = teams;
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectCreateDTO dto) {
        Edu_Teacher t = teachers.findByEmail(dto.teacherEmail);
        if (t == null) return ResponseEntity.badRequest().body("Teacher not found");

        Edu_Course c = courses.findByName(dto.courseName);
        if (c == null) return ResponseEntity.badRequest().body("Course not found");

        try {
            Edu_Project p = projects.createProject(t, c, dto.projectName);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ProjectResponse(p));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<ProjectResponse> listProjects() {
        return projects.findAll().stream()
                .map(ProjectResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{name}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable String name) {
        Edu_Project p = projects.findByName(name);
        return (p == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new ProjectResponse(p));
    }

    @PostMapping("/{name}/sprints")
    public ResponseEntity<?> createSprint(@PathVariable String name,
                                          @RequestBody SprintCreateDTO dto) {
        Edu_Project p = projects.findByName(name);
        if (p == null) return ResponseEntity.notFound().build();

        Edu_Teacher t = teachers.findByEmail(dto.teacherEmail);
        if (t == null) return ResponseEntity.badRequest().body("Teacher not found");

        Edu_Sprint sprint = t.createSprint(p, dto.start, dto.end, dto.objectives);
        return ResponseEntity.status(HttpStatus.CREATED).body(sprint);
    }

    @PostMapping("/{name}/evaluations")
    public ResponseEntity<?> evaluateTeam(@PathVariable String name,
                                          @RequestBody EvaluationCreateDTO dto) {
        Edu_Project p = projects.findByName(name);
        if (p == null) return ResponseEntity.notFound().build();

        if (dto.sprintIndex < 0 || dto.sprintIndex >= p.getSprints().size()) {
            return ResponseEntity.badRequest().body("Invalid sprint index");
        }

        Edu_Sprint sprint = p.getSprints().get(dto.sprintIndex);

        Edu_Team team = teams.findTeam(p, dto.teamName);
        if (team == null) return ResponseEntity.badRequest().body("Team not found");

        Edu_Teacher t = teachers.findByEmail(dto.teacherEmail);
        if (t == null) return ResponseEntity.badRequest().body("Teacher not found");

        Edu_Evaluation e = t.evaluateTeam(sprint, team, dto.metric, dto.value);
        return ResponseEntity.status(HttpStatus.CREATED).body(e);
    }

    @GetMapping("/{name}/evaluations")
    public ResponseEntity<?> listEvaluations(@PathVariable String name) {
        Edu_Project p = projects.findByName(name);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p.getEvaluations());
    }
}