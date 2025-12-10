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

import devapp.upt.Edu_Course;
import devapp.upt.api.dto.CourseCreateDTO;
import devapp.upt.api.dto.CourseEnrollDTO;
import devapp.upt.api.dto.CourseResponse;
import devapp.upt.api.dto.CourseUpdateDTO;
import devapp.upt.api.dto.StudentResponse;
import devapp.upt.api.dto.TeamRankingDTO;
import devapp.upt.api.services.CourseService;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courses;

    public CourseController(CourseService courses) {
        this.courses = courses;
    }

    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseCreateDTO dto) {
        try {
            Edu_Course c = courses.createCourse(dto.teacherEmail, dto.name, dto.description);
            return ResponseEntity.status(HttpStatus.CREATED).body(new CourseResponse(c));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<CourseResponse> listCourses() {
        return courses.findAll().stream()
                .map(CourseResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{name}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable String name) {
        Edu_Course c = courses.findByName(name);
        return (c == null)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(new CourseResponse(c));
    }

    @PostMapping("/{name}/enroll")
    public ResponseEntity<?> enrollStudent(@PathVariable String name,
            @RequestBody CourseEnrollDTO dto) {
        try {
            courses.enrollStudent(name, dto.studentEmail);
            return ResponseEntity.ok("Student enrolled");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{name}/students")
    public ResponseEntity<?> listStudents(@PathVariable String name) {
        Edu_Course c = courses.findByName(name);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        List<StudentResponse> res = c.getStudents().stream()
                .map(StudentResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{name}/ranking/students")
    public ResponseEntity<?> rankingStudents(@PathVariable String name) {
        Edu_Course c = courses.findByName(name);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        List<StudentResponse> res = c.getStudentRanking().stream()
                .map(StudentResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{name}/ranking/teams")
    public ResponseEntity<?> rankingTeams(@PathVariable String name) {
        Edu_Course c = courses.findByName(name);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        List<TeamRankingDTO> res = c.getTeamRanking()
                .stream()
                .map(TeamRankingDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/{name}/average-score")
    public ResponseEntity<?> averageScore(@PathVariable String name) {
        Edu_Course c = courses.findByName(name);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(c.getAverageScoreOfStudents());
    }

    @PutMapping("/{name}")
    public ResponseEntity<?> updateCourseDescription(
            @PathVariable String name,
            @RequestBody CourseUpdateDTO dto) {

        Edu_Course c = courses.findByName(name);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        c.setDescription(dto.description);
        return ResponseEntity.ok(new CourseResponse(c));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<?> deleteCourse(@PathVariable String name) {
        boolean removed = courses.delete(name);
        return removed ? ResponseEntity.ok("Deleted") : ResponseEntity.notFound().build();
    }
}
