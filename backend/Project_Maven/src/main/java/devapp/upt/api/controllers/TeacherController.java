package devapp.upt.api.controllers;

import devapp.upt.Edu_Teacher;
import devapp.upt.api.dto.LoginDTO;
import devapp.upt.api.dto.TeacherRegisterDTO;
import devapp.upt.api.dto.TeacherResponse;
import devapp.upt.api.services.TeacherService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teachers;

    public TeacherController(TeacherService teachers) {
        this.teachers = teachers;
    }

    @PostMapping("/register")
    public ResponseEntity<TeacherResponse> register(@RequestBody TeacherRegisterDTO dto) {
        Edu_Teacher t = teachers.register(dto.email, dto.password, dto.name);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TeacherResponse(t));
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginDTO dto) {
        return teachers.login(dto.email, dto.password)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping
    public List<TeacherResponse> list() {
        return teachers.findAll().stream()
                .map(TeacherResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{email}")
    public ResponseEntity<TeacherResponse> getByEmail(@PathVariable String email) {
        Edu_Teacher t = teachers.findByEmail(email);
        return (t == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new TeacherResponse(t));
    }
}