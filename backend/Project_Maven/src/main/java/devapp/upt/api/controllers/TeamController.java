package devapp.upt.api.controllers;

import devapp.upt.*;
import devapp.upt.api.dto.TeamAddMemberDTO;
import devapp.upt.api.dto.TeamCreateDTO;
import devapp.upt.api.dto.TeamResponse;
import devapp.upt.api.services.ProjectService;
import devapp.upt.api.services.StudentService;
import devapp.upt.api.services.TeamService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final ProjectService projects;
    private final TeamService teams;
    private final StudentService students;

    public TeamController(ProjectService projects,
            TeamService teams,
            StudentService students) {
        this.projects = projects;
        this.teams = teams;
        this.students = students;
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody TeamCreateDTO dto) {
        Edu_Project p = projects.findByName(dto.projectName);
        if (p == null) {
            return ResponseEntity.badRequest().body("Project not found");
        }

        Edu_Team t = teams.createTeam(p, dto.teamName);
        return ResponseEntity.status(HttpStatus.CREATED).body(new TeamResponse(t));
    }

    @GetMapping("/{projectName}/{teamName}")
    public ResponseEntity<?> getTeam(@PathVariable String projectName,
            @PathVariable String teamName) {
        Edu_Project p = projects.findByName(projectName);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }

        Edu_Team t = teams.findTeam(p, teamName);
        if (t == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new TeamResponse(t));
    }

    @PostMapping("/{projectName}/{teamName}/members")
    public ResponseEntity<?> addMember(@PathVariable String projectName,
            @PathVariable String teamName,
            @RequestBody TeamAddMemberDTO dto) {
        Edu_Project p = projects.findByName(projectName);
        if (p == null) {
            return ResponseEntity.badRequest().body("Project not found");
        }

        Edu_Team t = teams.findTeam(p, teamName);
        if (t == null) {
            return ResponseEntity.badRequest().body("Team not found");
        }

        Edu_Student s = students.findByEmail(dto.studentEmail);
        if (s == null) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        teams.addMember(t, s, dto.role);
        return ResponseEntity.ok(new TeamResponse(t));
    }

    @GetMapping("/{projectName}/{teamName}/score")
    public ResponseEntity<?> teamScore(@PathVariable String projectName,
            @PathVariable String teamName) {
        Edu_Project p = projects.findByName(projectName);
        if (p == null) {
            return ResponseEntity.notFound().build();
        }

        Edu_Team t = teams.findTeam(p, teamName);
        if (t == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new TeamResponse(t));
    }
}
